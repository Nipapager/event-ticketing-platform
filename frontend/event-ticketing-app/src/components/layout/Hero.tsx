import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  // Form state
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (city) params.append('city', city);
    if (date) params.append('date', date);
    
    // Navigate to events page with filters
    navigate(`/events?${params.toString()}`);
  };

  return (
    <div 
      className="relative h-96 bg-cover bg-center"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200)',
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Discover Unforgettable Experiences
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-center mb-8 max-w-2xl">
          Book tickets for concerts, sports, theater, and more in your city.
        </p>
        
        {/* Search Form */}
        <form 
          onSubmit={handleSearch}
          className="bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row gap-2 w-full max-w-4xl"
        >
          {/* Search Input */}
          <div className="flex-1 flex items-center px-4 py-2 border-r border-gray-200">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search Event, Artist, or Venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none text-gray-800"
            />
          </div>
          
          {/* City Input */}
          <div className="flex-1 flex items-center px-4 py-2 border-r border-gray-200">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="text"
              placeholder="City or Zip Code"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full outline-none text-gray-800"
            />
          </div>
          
          {/* Date Input */}
          <div className="flex-1 flex items-center px-4 py-2">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full outline-none text-gray-800"
            />
          </div>
          
          {/* Search Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;