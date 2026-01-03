import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import eventService from '../api/eventService';
import EventCard from '../components/common/EventCard';
import EventFilters from '../components/events/EventFilters';
import MobileFilters from '../components/events/MobileFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { Event } from '../types';

interface FilterOptions {
  cities: string[];
  categories: string[];
  dateFilter: string;
  priceRange: [number, number];
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    cities: [],
    categories: [],
    dateFilter: 'any',
    priceRange: [0, 500],
  });

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getAllEvents();
        setEvents(data);
        setFilteredEvents(data);
      } catch (err: any) {
        setError('Failed to load events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...events];

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // City filter
    if (filters.cities.length > 0) {
      filtered = filtered.filter(event =>
        event.venueCity && filters.cities.includes(event.venueCity)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(event =>
        filters.categories.includes(event.categoryName)
      );
    }

    // Date filter
    if (filters.dateFilter !== 'any') {
      const now = new Date();
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.eventDate);

        switch (filters.dateFilter) {
          case 'today':
            return eventDate.toDateString() === now.toDateString();
          case 'weekend':
            const dayOfWeek = eventDate.getDay();
            return dayOfWeek === 0 || dayOfWeek === 6;
          case 'month':
            return eventDate.getMonth() === now.getMonth() &&
              eventDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Price filter
    filtered = filtered.filter(event => {
      if (!event.ticketTypes || event.ticketTypes.length === 0) return true;
      const minPrice = Math.min(...event.ticketTypes.map(t => t.price));
      return minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1];
    });

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => {
        const minA = a.ticketTypes && a.ticketTypes.length > 0
          ? Math.min(...a.ticketTypes.map(t => t.price))
          : 0;
        const minB = b.ticketTypes && b.ticketTypes.length > 0
          ? Math.min(...b.ticketTypes.map(t => t.price))
          : 0;
        return minA - minB;
      });
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => {
        const minA = a.ticketTypes && a.ticketTypes.length > 0
          ? Math.min(...a.ticketTypes.map(t => t.price))
          : 0;
        const minB = b.ticketTypes && b.ticketTypes.length > 0
          ? Math.min(...b.ticketTypes.map(t => t.price))
          : 0;
        return minB - minA;
      });
    }

    setFilteredEvents(filtered);
  }, [events, filters, sortBy, searchQuery]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      cities: [],
      categories: [],
      dateFilter: 'any',
      priceRange: [0, 500],
    });
  };

  const activeFilterCount =
    filters.cities.length +
    filters.categories.length +
    (filters.dateFilter !== 'any' ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">All Events</h1>
              <p className="text-gray-600 mt-1">
                Showing {filteredEvents.length} of {events.length} events
              </p>
            </div>

            {/* Sort & Filter Controls */}
            <div className="flex items-center gap-3 mt-4 md:mt-0">

              {/* Mobile Filters Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters ({activeFilterCount})
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-medium hidden md:block">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">

          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block w-80 flex-shrink-0">
            <EventFilters
              filters={filters}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </aside>

          {/* Events Grid */}
          <main className="flex-1">

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" message="Loading events..." />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            )}

            {/* Events Grid */}
            {!loading && !error && (
              <>
                {filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No events found</p>
                    <p className="text-gray-500 mt-2">Try adjusting your filters</p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-4 text-blue-600 hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </>
            )}
          </main>

        </div>
      </div>

      {/* Mobile Filters Modal */}
      <MobileFilters
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

    </div>
  );
};

export default EventsPage;