import { useState, useEffect } from 'react';
import Hero from '../components/layout/Hero';
import EventCard from '../components/common/EventCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import eventService from '../api/eventService';
import type { Event } from '../types';
import { Link } from 'react-router-dom';

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
        setEvents(sortedEvents.slice(0, 8));
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
        {/* About Section */}
        <div className="max-w-7xl mx-auto px-4 py-16 border-t mt-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left - Text */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Welcome to EventSpot
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>EventSpot</strong> is your go-to platform for discovering and booking tickets to amazing events across Greece. From concerts and festivals to sports matches and cultural performances, we bring you the best entertainment experiences.
                </p>
                <p>
                  <strong>For Attendees:</strong> Browse upcoming events, purchase tickets securely, and receive QR codes instantly. Simply create an account to start booking your favorite events!
                </p>
                <p>
                  <strong>For Organizers:</strong> Do you host events or manage a venue?
                  <Link to="/request-organizer" className="text-blue-600 hover:text-blue-700 font-semibold ml-1">
                    Become an organizer
                  </Link> and reach thousands of potential attendees through our platform.
                </p>
              </div>

              <div className="flex gap-4 mt-8">
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Sign Up Now
                </Link>
                <Link
                  to="/request-organizer"
                  className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                >
                  Become Organizer
                </Link>
              </div>
            </div>

            {/* Right - Features */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Easy Booking</h3>
                  <p className="text-gray-600">Find and book tickets in just a few clicks with secure payment processing.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">QR Code Tickets</h3>
                  <p className="text-gray-600">Receive digital tickets with QR codes instantly via email and in your account.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Wide Selection</h3>
                  <p className="text-gray-600">Discover events across multiple categories and cities throughout Greece.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;