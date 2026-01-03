import { useState, useEffect } from 'react';
import Hero from '../components/layout/Hero';
import EventCard from '../components/common/EventCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import eventService from '../api/eventService';
import type { Event } from '../types';

const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAllEvents();
        setEvents(data.slice(0, 4));  // Take first 4 for "Trending"
      } catch (err: any) {
        setError('Failed to load events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <Hero />
      
      {/* Trending Events Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Trending Events Near You</h2>
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" message="Loading events..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-600">No events found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;