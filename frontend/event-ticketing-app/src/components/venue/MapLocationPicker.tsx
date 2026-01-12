import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { debounce } from 'lodash';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface MapLocationPickerProps {
  onLocationSelect: (address: string, city: string, lat: number, lon: number) => void;
  initialAddress?: string;
  initialCity?: string;
}

// Component to handle map clicks
const LocationMarker = ({ position, setPosition }: any) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position}></Marker> : null;
};

const MapLocationPicker = ({ onLocationSelect, initialAddress = '', initialCity = '' }: MapLocationPickerProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [city, setCity] = useState(initialCity);
  const [searchQuery, setSearchQuery] = useState(`${initialAddress} ${initialCity}`.trim());
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.6401, 22.9444]); // Default: Thessaloniki
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Update parent when address, city, or coordinates change
  useEffect(() => {
    if (address && city && markerPosition) {
      onLocationSelect(address, city, markerPosition[0], markerPosition[1]);
    }
  }, [address, city, markerPosition]);

  // Search for location to center map
  const searchLocation = async (query: string) => {
    if (query.length < 3) return;

    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query + ', Greece')}` +
        `&format=json` +
        `&limit=3`
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        
        if (data.length > 0) {
          const first = data[0];
          const lat = parseFloat(first.lat);
          const lon = parseFloat(first.lon);
          setMapCenter([lat, lon]);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const debouncedSearch = debounce(searchLocation, 800);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleResultClick = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setMapCenter([lat, lon]);
    setSearchResults([]);
  };

  const handleMarkerPositionChange = (position: [number, number]) => {
    setMarkerPosition(position);
  };

  const isComplete = address.trim() && city.trim() && markerPosition !== null;

  return (
    <div className="space-y-4">
      {/* Manual Address Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g., Tsimiski 50"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g., Thessaloniki"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Search to center map */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Search to Center Map (Optional)
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search area to zoom map (e.g., Aristotelous Square)"
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searching && (
            <div className="absolute right-3 top-3">
              <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <p className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
            Click to center map:
          </p>
          {searchResults.map((result, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleResultClick(result)}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b last:border-b-0 text-sm"
            >
              {result.display_name}
            </button>
          ))}
        </div>
      )}

      {/* Map */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Click on Map to Mark Location *
        </label>
        <div className="border-2 border-blue-300 rounded-lg overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={16}
            style={{ height: '400px', width: '100%' }}
            scrollWheelZoom={true}
            key={`${mapCenter[0]}-${mapCenter[1]}`}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker 
              position={markerPosition} 
              setPosition={handleMarkerPositionChange}
            />
          </MapContainer>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm font-semibold text-blue-800 mb-2">
          📍 Instructions:
        </p>
        <ol className="text-xs text-blue-700 space-y-1 ml-4 list-decimal">
          <li><strong>Enter the street address manually</strong> (e.g., "Tsimiski 50")</li>
          <li><strong>Enter the city</strong> (e.g., "Thessaloniki")</li>
          <li>Use the search box to zoom to your area (optional)</li>
          <li><strong>Click on the map</strong> at the exact venue location</li>
          <li>The marker and coordinates will be saved automatically</li>
        </ol>
      </div>

      {/* Validation Status */}
      {!isComplete && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-yellow-800">Complete all steps:</p>
              <ul className="text-xs text-yellow-700 mt-1 space-y-0.5">
                {!address.trim() && <li>✗ Enter street address</li>}
                {!city.trim() && <li>✗ Enter city</li>}
                {!markerPosition && <li>✗ Click on map to mark location</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Success Status */}
      {isComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800">✓ Venue Location Ready</p>
              <p className="text-xs text-green-700 mt-1">
                <strong>Address:</strong> {address}, {city}
              </p>
              <p className="text-xs text-green-600 mt-1">
                <strong>Coordinates:</strong> {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLocationPicker;