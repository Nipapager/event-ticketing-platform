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
        
        // Filter future events only
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const futureEvents = data.filter(event => {
          const eventDate = new Date(event.eventDate);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        });
        
        // Sort by sales (tickets sold) and then by date
        const sortedEvents = futureEvents.sort((a, b) => {
          // Calculate tickets sold for each event
          const soldA = a.ticketTypes?.reduce((total, ticket) => {
            return total + (ticket.totalQuantity - ticket.quantityAvailable);
          }, 0) || 0;
          
          const soldB = b.ticketTypes?.reduce((total, ticket) => {
            return total + (ticket.totalQuantity - ticket.quantityAvailable);
          }, 0) || 0;
          
          // If sales are equal, sort by date (soonest first)
          if (soldB === soldA) {
            return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
          }
          
          // Otherwise sort by sales (highest first)
          return soldB - soldA;
        });
        
        // Take top 4
        setEvents(sortedEvents.slice(0, 4));
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
        <h2 className="text-3xl font-bold mb-8">Trending Events</h2>
        
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
                <p className="text-gray-600">No upcoming events</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;