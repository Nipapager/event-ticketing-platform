import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../api/adminService';
import authService from '../api/authService';
import type { Order } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

type TimeFilter = 'LIFETIME' | 'H24' | 'D7' | 'D30' | 'D90' | 'D365';

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundingOrderId, setRefundingOrderId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('LIFETIME');

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'refund';
  } | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || !user.roles.includes('ROLE_ADMIN')) {
      navigate('/');
      return;
    }

    fetchAllOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (err: any) {
      toast.error('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = (orderId: number, orderTitle: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Refund Order',
      message: `Refund order ${orderTitle}? This will invalidate all tickets and restore availability.`,
      type: 'refund',
      onConfirm: async () => {
        try {
          setRefundingOrderId(orderId);
          await adminService.refundOrder(orderId);
          toast.success('Order refunded successfully!');
          await fetchAllOrders();
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Failed to process refund';
          toast.error(errorMessage);
          console.error(err);
        } finally {
          setRefundingOrderId(null);
          setConfirmModal(null);
        }
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'REFUNDED':
        return 'bg-red-100 text-red-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'FAILED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRangeForTimeFilter = (tf: TimeFilter) => {
    const now = new Date();
    if (tf === 'LIFETIME') return { start: null as Date | null, end: now };

    const ms = (() => {
      switch (tf) {
        case 'H24':
          return 24 * 60 * 60 * 1000;
        case 'D7':
          return 7 * 24 * 60 * 60 * 1000;
        case 'D30':
          return 30 * 24 * 60 * 60 * 1000;
        case 'D90':
          return 90 * 24 * 60 * 60 * 1000;
        case 'D365':
          return 365 * 24 * 60 * 60 * 1000;
        default:
          return 0;
      }
    })();

    return { start: new Date(now.getTime() - ms), end: now };
  };

  const timeRange = useMemo(() => getRangeForTimeFilter(timeFilter), [timeFilter]);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return orders.filter(order => {
      const orderDt = new Date(order.orderDate);

      const matchesTime =
        !timeRange.start ? true : orderDt >= timeRange.start && orderDt <= timeRange.end;

      const matchesSearch =
        !term ||
        order.id.toString().includes(term) ||
        order.userName.toLowerCase().includes(term) ||
        order.userEmail.toLowerCase().includes(term) ||
        order.eventTitle.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'ALL' || order.paymentStatus === statusFilter;

      return matchesTime && matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter, timeRange.start, timeRange.end]);

  const stats = useMemo(() => {
    const list = filteredOrders;

    const completed = list.filter(o => o.paymentStatus === 'COMPLETED');
    const pending = list.filter(o => o.paymentStatus === 'PENDING');
    const refunded = list.filter(o => o.paymentStatus === 'REFUNDED');

    const revenue = completed.reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      total: list.length,
      completed: completed.length,
      pending: pending.length,
      refunded: refunded.length,
      revenue,
    };
  }, [filteredOrders]);

  const getTimeFilterLabel = (tf: TimeFilter) => {
    switch (tf) {
      case 'H24':
        return 'Last 24 hours';
      case 'D7':
        return 'Last 7 days';
      case 'D30':
        return 'Last 30 days';
      case 'D90':
        return 'Last 90 days';
      case 'D365':
        return 'Last 365 days';
      case 'LIFETIME':
      default:
        return 'Lifetime';
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading orders..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Management</h1>
          <p className="text-gray-600">View and manage all customer orders</p>
        </div>

        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {([
                { key: 'H24', label: '24h' },
                { key: 'D7', label: '7d' },
                { key: 'D30', label: '30d' },
                { key: 'D90', label: '90d' },
                { key: 'D365', label: '365d' },
                { key: 'LIFETIME', label: 'Lifetime' },
              ] as { key: TimeFilter; label: string }[]).map(t => (
                <button
                  key={t.key}
                  onClick={() => setTimeFilter(t.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeFilter === t.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="text-sm text-gray-600">
              Showing: <span className="font-semibold text-gray-800">{getTimeFilterLabel(timeFilter)}</span>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Refunded</p>
            <p className="text-2xl font-bold text-red-600">{stats.refunded}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-600">€{stats.revenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by Order ID, User, Email, or Event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Payments</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="REFUNDED">Refunded</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      {(searchTerm || statusFilter !== 'ALL' || timeFilter !== 'LIFETIME')
                        ? 'No orders match your filters'
                        : 'No orders found'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.userName}</div>
                        <div className="text-sm text-gray-500">{order.userEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.eventTitle}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.eventDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          €{order.totalAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {order.paymentStatus === 'COMPLETED' ? (
                          <button
                            onClick={() => handleRefund(order.id, `#${order.id}`)}
                            disabled={refundingOrderId === order.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {refundingOrderId === order.id ? 'Processing...' : 'Refund'}
                          </button>
                        ) : order.paymentStatus === 'REFUNDED' ? (
                          <span className="text-gray-500 text-xs">Refunded</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {(searchTerm || statusFilter !== 'ALL' || timeFilter !== 'LIFETIME') && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        )}
      </div>

      {confirmModal?.isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setConfirmModal(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{confirmModal.title}</h3>
                <p className="text-gray-600">{confirmModal.message}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={refundingOrderId !== null}
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={refundingOrderId !== null}
              >
                {refundingOrderId !== null ? 'Processing...' : 'Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
