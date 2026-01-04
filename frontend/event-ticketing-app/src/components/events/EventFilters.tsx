import { useState } from 'react';

interface FilterOptions {
  cities: string[];
  categories: string[];
  dateFilter: string;
  priceRange: [number, number];
}

interface EventFiltersProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  onClear: () => void;
  availableCities: string[];
  availableCategories: string[];
}

const EventFilters = ({ 
  filters, 
  onChange, 
  onClear,
  availableCities,
  availableCategories 
}: EventFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleCityChange = (city: string) => {
    const newCities = localFilters.cities.includes(city)
      ? localFilters.cities.filter(c => c !== city)
      : [...localFilters.cities, city];

    const updated = { ...localFilters, cities: newCities };
    setLocalFilters(updated);
    onChange(updated);
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category];

    const updated = { ...localFilters, categories: newCategories };
    setLocalFilters(updated);
    onChange(updated);
  };

  const handleClear = () => {
    const cleared: FilterOptions = {
      cities: [],
      categories: [],
      dateFilter: 'any',
      priceRange: [0, 500],
    };
    setLocalFilters(cleared);
    onClear();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Filters</h3>
        <button
          onClick={handleClear}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* City Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">City</h4>
        {availableCities.length > 0 ? (
          availableCities.map((city) => (
            <label key={city} className="flex items-center mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.cities.includes(city)}
                onChange={() => handleCityChange(city)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">{city}</span>
            </label>
          ))
        ) : (
          <p className="text-sm text-gray-500">No cities available</p>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Category</h4>
        {availableCategories.length > 0 ? (
          availableCategories.map((category) => (
            <label key={category} className="flex items-center mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">{category}</span>
            </label>
          ))
        ) : (
          <p className="text-sm text-gray-500">No categories available</p>
        )}
      </div>

      {/* Date Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Date</h3>
        <div className="space-y-2">
          {[
            { value: 'any', label: 'Any Date' },
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="dateFilter"
                value={option.value}
                checked={filters.dateFilter === option.value}
                onChange={(e) =>
                  onChange({ ...filters, dateFilter: e.target.value })
                }
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Price Range</h4>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>€{localFilters.priceRange[0]}</span>
          <span>€{localFilters.priceRange[1]}</span>
        </div>
        <input
          type="range"
          min="0"
          max="500"
          value={localFilters.priceRange[1]}
          onChange={(e) => {
            const updated = { ...localFilters, priceRange: [0, parseInt(e.target.value)] as [number, number] };
            setLocalFilters(updated);
            onChange(updated);
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

    </div>
  );
};

export default EventFilters;