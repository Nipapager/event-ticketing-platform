import { useState } from 'react';

interface FilterOptions {
  cities: string[];
  categories: string[];
  dateFilter: string;
  priceRange: [number, number];
}

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  onClear: () => void;
  availableCities: string[];
  availableCategories: string[];
}

const MobileFilters = ({ 
  isOpen, 
  onClose, 
  filters, 
  onChange, 
  onClear,
  availableCities,
  availableCategories 
}: MobileFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleCityChange = (city: string) => {
    const newCities = localFilters.cities.includes(city)
      ? localFilters.cities.filter(c => c !== city)
      : [...localFilters.cities, city];
    setLocalFilters({ ...localFilters, cities: newCities });
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category];
    setLocalFilters({ ...localFilters, categories: newCategories });
  };

  const handleApply = () => {
    onChange(localFilters);
    onClose();
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-y-auto">
        <div className="p-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Filters</h3>
            <button
              onClick={handleClear}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* City */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">City</h4>
            {availableCities.length > 0 ? (
              availableCities.map((city) => (
                <label key={city} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={localFilters.cities.includes(city)}
                    onChange={() => handleCityChange(city)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">{city}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No cities available</p>
            )}
          </div>

          {/* Category */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Category</h4>
            {availableCategories.length > 0 ? (
              availableCategories.map((category) => (
                <label key={category} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={localFilters.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">{category}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No categories available</p>
            )}
          </div>

          {/* Date */}
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
                    checked={localFilters.dateFilter === option.value}
                    onChange={(e) =>
                      setLocalFilters({ ...localFilters, dateFilter: e.target.value })
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
              onChange={(e) => setLocalFilters({
                ...localFilters,
                priceRange: [0, parseInt(e.target.value)]
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Apply Filters
          </button>

        </div>
      </div>
    </>
  );
};

export default MobileFilters;