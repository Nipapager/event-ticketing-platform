import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

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
        
        {/* Browse Button */}
        <button
          onClick={() => navigate('/events')}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          Browse All Events
        </button>
      </div>
    </div>
  );
};

export default Hero;