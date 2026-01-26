import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../api/authService';
import eventService from '../api/eventService';
import adminService from '../api/adminService';
import userManagementService from '../api/userManagementService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { Event, Order, User } from '../types';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalOrganizers: number;
  totalEvents: number;
  pendingEvents: number;
  approvedEvents: number;
  rejectedEvents: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: number;
  upcomingEvents: number;
  pastEvents: number;
  averageOrderValue: number;
  conversionRate: number;
}

interface EventWithSales extends Event {
  ticketsSold: number;
  revenue: number;
}

interface OrganizerSalesStats {
  organizerId: number;
  organizerName: string;
  eventsCount: number;
  ticketsSold: number;
  revenue: number;
}

type TimePeriod = 'week' | 'month' | 'quarter' | 'year' | 'all';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    pendingEvents: 0,
    approvedEvents: 0,
    rejectedEvents: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: 0,
    upcomingEvents: 0,
    pastEvents: 0,
    averageOrderValue: 0,
    conversionRate: 0,
  });

  const [topEvents, setTopEvents] = useState<EventWithSales[]>([]);
  const [recentActivity, setRecentActivity] = useState<Order[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  // NEW: top organizers
  const [topOrganizers, setTopOrganizers] = useState<OrganizerSalesStats[]>([]);
  const [showAllOrganizers, setShowAllOrganizers] = useState(false);

  // All raw data
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || !currentUser.roles.includes('ROLE_ADMIN')) {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  useEffect(() => {
    if (allEvents.length > 0 && allOrders.length > 0 && allUsers.length > 0) {
      calculateStats();
      generateChartData();
      calculateTopOrganizers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timePeriod, allEvents, allOrders, allUsers]);

  const getDateRange = (): { startDate: Date; endDate: Date } => {
    const endDate = new Date();
    const startDate = new Date();

    switch (timePeriod) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case 'all':
        startDate.setFullYear(2020, 0, 1);
        break;
    }

    return { startDate, endDate };
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [events, orders, users] = await Promise.all([
        eventService.getAllEvents(),
        adminService.getAllOrders(),
        userManagementService.getAllUsers(),
      ]);

      setAllEvents(events);
      setAllOrders(orders);
      setAllUsers(users);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getOrganizerName = (organizerId?: number, fallback?: string) => {
    if (!organizerId) return fallback || 'Unknown';
    const u = allUsers.find((x) => (x as any).id === organizerId);
    const name =
      (u as any)?.name ||
      (u as any)?.fullName ||
      (u as any)?.username ||
      (u as any)?.email;
    return name || fallback || `User #${organizerId}`;
  };

  const calculateStats = () => {
    const { startDate, endDate } = getDateRange();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter data by time period
    const filteredOrders = allOrders.filter(
      (o) => new Date(o.orderDate) >= startDate && new Date(o.orderDate) <= endDate
    );

    const filteredEvents = allEvents.filter(
      (e) =>
        new Date((e as any).createdAt || e.eventDate) >= startDate &&
        new Date((e as any).createdAt || e.eventDate) <= endDate
    );

    // User stats
    const totalUsers = allUsers.length;
    const totalOrganizers = allUsers.filter((u: User) =>
      u.roles?.includes('ROLE_ORGANIZER') || u.roles?.includes('ROLE_ADMIN')
    ).length;

    // Event stats
    const totalEvents = allEvents.length;
    const pendingEvents = allEvents.filter((e: Event) => (e as any).status === 'PENDING').length;
    const approvedEvents = allEvents.filter((e: Event) => (e as any).status === 'APPROVED').length;
    const rejectedEvents = allEvents.filter((e: Event) => (e as any).status === 'REJECTED').length;

    const upcomingEvents = allEvents.filter((e: Event) => {
      const eventDate = new Date(e.eventDate);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today && (e as any).status === 'APPROVED';
    }).length;

    const pastEvents = allEvents.filter((e: Event) => {
      const eventDate = new Date(e.eventDate);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate < today;
    }).length;

    // Order stats (timePeriod-based)
    const totalOrders = filteredOrders.length;
    const completedOrders = filteredOrders.filter((o: Order) => o.paymentStatus === 'COMPLETED');
    const totalRevenue = completedOrders.reduce((sum: number, o: Order) => sum + o.totalAmount, 0);

    // Recent orders (last 7 days, regardless timePeriod - same as your original)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrders = allOrders.filter((o: Order) => new Date(o.orderDate) >= sevenDaysAgo).length;

    // Calculate metrics
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate = totalEvents > 0 ? (totalOrders / totalEvents) * 100 : 0;

    // Top events by ticket sales (same logic as your original)
    const eventSales: EventWithSales[] = allEvents.map((event: Event) => {
      const eventOrders = allOrders.filter((o: Order) => o.eventId === event.id);
      const ticketsSold = eventOrders.reduce(
        (sum: number, o: Order) =>
          sum + o.orderItems.reduce((s: number, item) => s + item.quantity, 0),
        0
      );
      const revenue = eventOrders
        .filter((o: Order) => o.paymentStatus === 'COMPLETED')
        .reduce((sum: number, o: Order) => sum + o.totalAmount, 0);

      return { ...event, ticketsSold, revenue };
    });

    const sortedByRevenue = [...eventSales].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    setTopEvents(sortedByRevenue);

    // Recent activity (last 10 orders)
    const sortedOrders = [...allOrders]
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, 10);
    setRecentActivity(sortedOrders);

    setStats({
      totalUsers,
      totalOrganizers,
      totalEvents,
      pendingEvents,
      approvedEvents,
      rejectedEvents,
      totalOrders,
      totalRevenue,
      recentOrders,
      upcomingEvents,
      pastEvents,
      averageOrderValue,
      conversionRate,
    });

    // (filteredEvents is currently unused, kept because it existed in your original logic)
    void filteredEvents;
  };

  const calculateTopOrganizers = () => {
    const { startDate, endDate } = getDateRange();

    const filteredCompletedOrders = allOrders.filter(
      (o) =>
        o.paymentStatus === 'COMPLETED' &&
        new Date(o.orderDate) >= startDate &&
        new Date(o.orderDate) <= endDate
    );

    // eventId -> event
    const eventById = new Map<number, Event>();
    allEvents.forEach((e) => eventById.set(e.id as any, e));

    // organizerId -> stats
    const agg = new Map<number, OrganizerSalesStats>();

    filteredCompletedOrders.forEach((order) => {
      const event = eventById.get(order.eventId as any);
      if (!event) return;

      const organizerId = (event as any).organizerId as number | undefined;
      const organizerName = getOrganizerName(organizerId, (event as any).organizerName);

      if (!organizerId) return;

      if (!agg.has(organizerId)) {
        agg.set(organizerId, {
          organizerId,
          organizerName,
          eventsCount: 0,
          ticketsSold: 0,
          revenue: 0,
        });
      }

      const stat = agg.get(organizerId)!;

      const orderTickets = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      stat.ticketsSold += orderTickets;
      stat.revenue += order.totalAmount;
    });

    // eventsCount: total events per organizer (all-time) — matches “αριθμό events”
    const eventsCountByOrganizer = new Map<number, number>();
    allEvents.forEach((e) => {
      const oid = (e as any).organizerId as number | undefined;
      if (!oid) return;
      eventsCountByOrganizer.set(oid, (eventsCountByOrganizer.get(oid) || 0) + 1);
    });

    const list = Array.from(agg.values()).map((s) => ({
      ...s,
      eventsCount: eventsCountByOrganizer.get(s.organizerId) || 0,
    }));

    list.sort((a, b) => b.ticketsSold - a.ticketsSold);
    setTopOrganizers(list);
  };

  const generateChartData = () => {
    const { startDate, endDate } = getDateRange();

    // Revenue Over Time
    const revenueByDate: { [key: string]: number } = {};
    const filteredOrders = allOrders.filter(
      (o) => new Date(o.orderDate) >= startDate && new Date(o.orderDate) <= endDate
    );

    filteredOrders.forEach((order) => {
      if (order.paymentStatus === 'COMPLETED') {
        const date = new Date(order.orderDate);
        const key =
          timePeriod === 'week' || timePeriod === 'month'
            ? date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
            : timePeriod === 'quarter'
            ? date.toLocaleDateString('en-GB', { month: 'short' })
            : date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

        revenueByDate[key] = (revenueByDate[key] || 0) + order.totalAmount;
      }
    });

    const revenueChartData = Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue: Number(revenue.toFixed(2)),
    }));

    setRevenueData(revenueChartData);

    // Category Distribution
    const categoryRevenue: { [key: string]: number } = {};
    allEvents.forEach((event) => {
      const eventOrders = allOrders.filter(
        (o) => o.eventId === event.id && o.paymentStatus === 'COMPLETED'
      );
      const revenue = eventOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const category = (event as any).categoryName || 'Unknown';
      categoryRevenue[category] = (categoryRevenue[category] || 0) + revenue;
    });

    const categoryChartData = Object.entries(categoryRevenue)
      .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    setCategoryData(categoryChartData);

  };

  const formatCurrency = (value: number) => `€${value.toFixed(2)}`;

  const topOrganizersVisible = useMemo(() => {
    return showAllOrganizers ? topOrganizers : topOrganizers.slice(0, 10);
  }, [showAllOrganizers, topOrganizers]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Time Period Filter */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Platform overview and analytics</p>
          </div>

          {/* Time Period Selector */}
          <div className="flex gap-2 bg-white rounded-lg shadow-sm p-1">
            {[
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'quarter', label: 'Quarter' },
              { value: 'year', label: 'Year' },
              { value: 'all', label: 'All Time' },
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setTimePeriod(period.value as TimePeriod)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timePeriod === period.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium opacity-80">REVENUE</span>
            </div>
            <h3 className="text-4xl font-bold mb-2">€{stats.totalRevenue.toFixed(2)}</h3>
            <p className="text-sm opacity-80">Average: €{stats.averageOrderValue.toFixed(2)}/order</p>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <span className="text-xs text-gray-500 font-medium">ORDERS</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.totalOrders}</h3>
            <p className="text-sm text-gray-600">{stats.recentOrders} this week</p>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <span className="text-xs text-gray-500 font-medium">USERS</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.totalUsers}</h3>
            <p className="text-sm text-gray-600">{stats.totalOrganizers} organizers</p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <span className="text-xs text-gray-500 font-medium">CONVERSION</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.conversionRate.toFixed(1)}%</h3>
            <p className="text-sm text-gray-600">Orders per event</p>
          </div>
        </div>

        {/* Event Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Pending Events */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md p-6 border border-yellow-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-yellow-800">Pending Approval</h3>
              <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-yellow-800 mb-2">{stats.pendingEvents}</p>
            <p className="text-sm text-yellow-700 mb-4">Events awaiting review</p>
            <button
              onClick={() => navigate('/admin/event-manager')}
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-sm"
            >
              Review Events
            </button>
          </div>

          {/* Approved Events */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-green-800">Approved Events</h3>
              <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-green-800 mb-2">{stats.approvedEvents}</p>
            <p className="text-sm text-green-700">{stats.upcomingEvents} upcoming</p>
          </div>

          {/* Rejected Events */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border border-red-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-red-800">Rejected Events</h3>
              <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-red-800 mb-2">{stats.rejectedEvents}</p>
            <p className="text-sm text-red-700">Did not meet criteria</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Over Time */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Revenue Over Time</h2>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `€${Number(value).toFixed(2)}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                    name="Revenue (€)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No revenue data for this period</p>
            )}
          </div>

          {/* Category Revenue Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Revenue by Category</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: €${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `€${Number(value).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No category data available</p>
            )}
          </div>

          {/* ✅ NEW SECTION: Top Organizers */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Top Organizers by Tickets Sold</h2>

              {topOrganizers.length > 10 && (
                <button
                  onClick={() => setShowAllOrganizers((v) => !v)}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  {showAllOrganizers ? 'Show Top 10' : 'Expand All'}
                </button>
              )}
            </div>

            {topOrganizers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No organizer sales for this period</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left text-gray-600">
                      <th className="py-2 pr-4">Organizer</th>
                      <th className="py-2 pr-4">Events</th>
                      <th className="py-2 pr-4">Tickets Sold</th>
                      <th className="py-2">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topOrganizersVisible.map((org, idx) => (
                      <tr key={org.organizerId} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-semibold text-gray-800">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null}{' '}
                          {org.organizerName}
                        </td>
                        <td className="py-3 pr-4">{org.eventsCount}</td>
                        <td className="py-3 pr-4 font-semibold">{org.ticketsSold}</td>
                        <td className="py-3 font-semibold text-green-600">
                          {formatCurrency(org.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {topOrganizers.length > 10 && (
              <p className="text-xs text-gray-500 mt-3">
                Showing {topOrganizersVisible.length} of {topOrganizers.length} organizers (filtered by
                selected time period)
              </p>
            )}
          </div>

          {/* ❌ Removed ONLY:
              - Order Status Distribution
              - User Growth
          */}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Events by Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Top Events by Revenue</h2>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>

            {topEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No events with sales yet</p>
            ) : (
              <div className="space-y-4">
                {topEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0
                            ? 'bg-yellow-500'
                            : index === 1
                            ? 'bg-gray-400'
                            : index === 2
                            ? 'bg-orange-600'
                            : 'bg-blue-500'
                        }`}
                      >
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{(event as any).title}</p>
                      <p className="text-sm text-gray-600">{event.ticketsSold} tickets sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">€{event.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent orders</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentActivity.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{(order as any).eventTitle}</p>
                      <p className="text-sm text-gray-600">{(order as any).userName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-gray-800">€{order.totalAmount.toFixed(2)}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          order.paymentStatus === 'COMPLETED'
                            ? 'bg-green-100 text-green-700'
                            : order.paymentStatus === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : order.paymentStatus === 'REFUNDED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate('/admin/orders')}
              className="mt-4 w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
            >
              View All Orders
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/event-manager')}
              className="flex items-center justify-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <svg
                className="w-6 h-6 text-blue-600 group-hover:text-blue-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <div className="text-left">
                <p className="font-bold text-gray-800">Manage Events</p>
                <p className="text-sm text-gray-600">Approve or reject events</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/orders')}
              className="flex items-center justify-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors group"
            >
              <svg
                className="w-6 h-6 text-green-600 group-hover:text-green-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <div className="text-left">
                <p className="font-bold text-gray-800">Manage Orders</p>
                <p className="text-sm text-gray-600">View and refund orders</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/user-manager')}
              className="flex items-center justify-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors group"
            >
              <svg
                className="w-6 h-6 text-purple-600 group-hover:text-purple-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <div className="text-left">
                <p className="font-bold text-gray-800">Manage Users</p>
                <p className="text-sm text-gray-600">Update user roles</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
