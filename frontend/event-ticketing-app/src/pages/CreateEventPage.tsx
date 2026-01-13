import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import eventService from '../api/eventService';
import ticketTypeService from '../api/ticketTypeService';
import categoryService from '../api/categoryService';
import venueService from '../api/venueService';
import authService from '../api/authService';
import type { Category, Venue } from '../types';
import MapLocationPicker from '../components/venue/MapLocationPicker';

interface TicketType {
  name: string;
  price: string;
  totalQuantity: string;
  description: string;
}

// Pre-made event images from Unsplash
const PRESET_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop',
    category: 'Concert',
    description: 'Live concert with crowd'
  },
  {
    url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop',
    category: 'Conference',
    description: 'Business conference'
  },
  {
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
    category: 'Concert',
    description: 'Music festival stage'
  },
  {
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop',
    category: 'Party',
    description: 'Night party with lights'
  },
  {
    url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&auto=format&fit=crop',
    category: 'DJ',
    description: 'DJ performance'
  },
  {
    url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&auto=format&fit=crop',
    category: 'Bar',
    description: 'Bar with cocktails'
  },
  {
    url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&auto=format&fit=crop',
    category: 'Bar',
    description: 'Cocktail bar atmosphere'
  },
  {
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    category: 'Conference',
    description: 'Tech conference'
  },
  {
    url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop',
    category: 'Theater',
    description: 'Theater performance'
  },
  {
    url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop',
    category: 'Festival',
    description: 'Outdoor music festival'
  },
  {
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop',
    category: 'Concert',
    description: 'Stadium concert'
  },
  {
    url: 'https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=800&auto=format&fit=crop',
    category: 'Sports',
    description: 'Sports stadium'
  },
  {
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop',
    category: 'Party',
    description: 'Club party lights'
  },
  {
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop',
    category: 'DJ',
    description: 'DJ mixing music'
  },
  {
    url: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&auto=format&fit=crop',
    category: 'Party',
    description: 'Halloween party'
  },
  {
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop',
    category: 'Conference',
    description: 'Workshop event'
  },
  {
    url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop',
    category: 'Concert',
    description: 'Jazz concert'
  },
  {
    url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop',
    category: 'Concert',
    description: 'Hip hop concert'
  },
  {
    url: 'https://images.unsplash.com/photo-1519214605650-76a613ee3245?w=800&auto=format&fit=crop',
    category: 'Bar',
    description: 'Upscale bar'
  },
  {
    url: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&auto=format&fit=crop',
    category: 'Theater',
    description: 'Comedy show'
  }
];

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);

  // Modals
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);

  // New category/venue data
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newVenue, setNewVenue] = useState({
    name: '',
    address: '',
    city: '',
    capacity: '',
    latitude: 0,
    longitude: 0
  });

  // Event form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    venueId: '',
    eventDate: '',
    eventTime: '',
    imageUrl: ''
  });

  // Ticket types (at least one required)
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { name: 'General Admission', price: '', totalQuantity: '', description: '' }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchCategoriesAndVenues();
  }, []);

  const fetchCategoriesAndVenues = async () => {
    try {
      const [categoriesData, venuesData] = await Promise.all([
        categoryService.getAllCategories(),
        venueService.getAllVenues()
      ]);
      setCategories(categoriesData);
      setVenues(venuesData);
    } catch (error) {
      console.error('Failed to load categories/venues', error);
      toast.error('Failed to load form data');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleTicketTypeChange = (index: number, field: keyof TicketType, value: string) => {
    const updated = [...ticketTypes];
    updated[index][field] = value;
    setTicketTypes(updated);
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', price: '', totalQuantity: '', description: '' }]);
  };

  const removeTicketType = (index: number) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(ticketTypes.filter((_, i) => i !== index));
    }
  };

  const handleSelectPresetImage = (imageUrl: string) => {
    setFormData({ ...formData, imageUrl });
    setShowImageGallery(false);
    toast.success('Image selected!');
  };

  // CREATE NEW CATEGORY
  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const toastId = toast.loading('Creating category...');
    try {
      const created = await categoryService.createCategory(newCategory);
      setCategories([...categories, created]);
      setFormData({ ...formData, categoryId: created.id.toString() });
      setNewCategory({ name: '', description: '' });
      setShowCategoryModal(false);
      toast.success('Category created!', { id: toastId });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create category', { id: toastId });
    }
  };

  // CREATE NEW VENUE
  const handleCreateVenue = async () => {
    if (!newVenue.name.trim() || !newVenue.address.trim() || !newVenue.city.trim() || !newVenue.capacity) {
      toast.error('All venue fields are required');
      return;
    }

    if (newVenue.latitude === 0 || newVenue.longitude === 0) {
      toast.error('Please click on the map to mark the venue location');
      return;
    }

    const toastId = toast.loading('Creating venue...');
    try {
      const created = await venueService.createVenue({
        name: newVenue.name,
        address: newVenue.address,
        city: newVenue.city,
        capacity: parseInt(newVenue.capacity),
        latitude: newVenue.latitude,
        longitude: newVenue.longitude
      });

      setVenues([...venues, created]);
      setFormData({ ...formData, venueId: created.id.toString() });
      setNewVenue({ name: '', address: '', city: '', capacity: '', latitude: 0, longitude: 0 });
      setShowVenueModal(false);
      toast.success('Venue created successfully!', { id: toastId });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create venue', { id: toastId });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.venueId) newErrors.venueId = 'Venue is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.eventTime) newErrors.eventTime = 'Event time is required';

    // Validate ticket types
    ticketTypes.forEach((ticket, index) => {
      if (!ticket.name.trim()) newErrors[`ticket_${index}_name`] = 'Ticket name required';
      if (!ticket.price || parseFloat(ticket.price) <= 0) newErrors[`ticket_${index}_price`] = 'Valid price required';
      if (!ticket.totalQuantity || parseInt(ticket.totalQuantity) <= 0) newErrors[`ticket_${index}_quantity`] = 'Valid quantity required';
      if (!ticket.description.trim()) newErrors[`ticket_${index}_description`] = 'Description required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const toastId = toast.loading('Creating event...');

    try {
      // Step 1: Create event
      const event = await eventService.createEvent({
        ...formData,
        categoryId: parseInt(formData.categoryId),
        venueId: parseInt(formData.venueId)
      });

      // Step 2: Create ticket types
      await Promise.all(
        ticketTypes.map(ticket =>
          ticketTypeService.createTicketType(event.id, {
            name: ticket.name,
            price: parseFloat(ticket.price),
            totalQuantity: parseInt(ticket.totalQuantity),
            description: ticket.description
          })
        )
      );

      toast.success('Event created successfully! Awaiting admin approval.', { id: toastId });
      navigate('/my-events');
    } catch (error: any) {
      console.error('Failed to create event:', error);
      toast.error(error.response?.data?.message || 'Failed to create event', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Event</h1>
          <p className="text-gray-600">Fill in the details below to create your event</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Summer Music Festival 2025"
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your event..."
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Category & Venue */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      title="Add new category"
                    >
                      +
                    </button>
                  </div>
                  {errors.categoryId && <p className="text-red-600 text-sm mt-1">{errors.categoryId}</p>}
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Venue *
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="venueId"
                      value={formData.venueId}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select venue</option>
                      {venues.map(venue => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name} - {venue.city}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowVenueModal(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      title="Add new venue"
                    >
                      +
                    </button>
                  </div>
                  {errors.venueId && <p className="text-red-600 text-sm mt-1">{errors.venueId}</p>}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.eventDate && <p className="text-red-600 text-sm mt-1">{errors.eventDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Time *
                  </label>
                  <input
                    type="time"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.eventTime && <p className="text-red-600 text-sm mt-1">{errors.eventTime}</p>}
                </div>
              </div>

              {/* Image Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Image
                </label>

                {/* Image Preview */}
                {formData.imageUrl && (
                  <div className="mb-3">
                    <img
                      src={formData.imageUrl}
                      alt="Event preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                )}

                {/* Image URL Input */}
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  placeholder="https://example.com/image.jpg"
                />

                {/* Browse Gallery Button */}
                <button
                  type="button"
                  onClick={() => setShowImageGallery(true)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Browse Image Gallery
                </button>

                <p className="text-xs text-gray-500 mt-2">
                  💡 Enter an image URL or choose from our gallery
                </p>
              </div>
            </div>
          </div>

          {/* Ticket Types Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Ticket Types</h2>
              <button
                type="button"
                onClick={addTicketType}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Ticket Type
              </button>
            </div>

            <div className="space-y-4">
              {ticketTypes.map((ticket, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-700">Ticket Type {index + 1}</h3>
                    {ticketTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTicketType(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={ticket.name}
                        onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., VIP, General, Early Bird"
                      />
                      {errors[`ticket_${index}_name`] && (
                        <p className="text-red-600 text-xs mt-1">{errors[`ticket_${index}_name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (€) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={ticket.price}
                        onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                      {errors[`ticket_${index}_price`] && (
                        <p className="text-red-600 text-xs mt-1">{errors[`ticket_${index}_price`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={ticket.totalQuantity}
                        onChange={(e) => handleTicketTypeChange(index, 'totalQuantity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="100"
                      />
                      {errors[`ticket_${index}_quantity`] && (
                        <p className="text-red-600 text-xs mt-1">{errors[`ticket_${index}_quantity`]}</p>
                      )}
                    </div>
                  </div>

                  {/* Description Field - FULL WIDTH */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={ticket.description}
                      onChange={(e) => handleTicketTypeChange(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Early bird discount for first 100 tickets, Student ticket - ID required at entrance, etc."
                    />
                    {errors[`ticket_${index}_description`] && (
                      <p className="text-red-600 text-xs mt-1">{errors[`ticket_${index}_description`]}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Explain what this ticket includes, any restrictions, or special conditions
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>

      {/* IMAGE GALLERY MODAL */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Choose an Event Image</h3>
              <button
                onClick={() => setShowImageGallery(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {PRESET_IMAGES.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectPresetImage(image.url)}
                  className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <img
                    src={image.url}
                    alt={image.description}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end pointer-events-none">
                    <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs font-semibold">{image.category}</p>
                      <p className="text-xs">{image.description}</p>
                    </div>
                  </div>

                  {formData.imageUrl === image.url && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowImageGallery(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Category</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Concert, Sports"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Brief description..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowCategoryModal(false);
                  setNewCategory({ name: '', description: '' });
                }}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCategory}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD VENUE MODAL */}
      {showVenueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Venue</h3>

            <div className="space-y-4">
              {/* Venue Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Venue Name *
                </label>
                <input
                  type="text"
                  value={newVenue.name}
                  onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Thessaloniki Concert Hall"
                />
              </div>

              <MapLocationPicker
                onLocationSelect={(address, city, lat, lon) => {
                  setNewVenue({
                    ...newVenue,
                    address,
                    city,
                    latitude: lat,
                    longitude: lon
                  });
                }}
                initialAddress={newVenue.address}
                initialCity={newVenue.city}
              />

              {/* Show selected location */}
              {newVenue.latitude !== 0 && newVenue.longitude !== 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-green-800 mb-1">
                    ✓ Location Selected
                  </p>
                  <p className="text-xs text-green-700">
                    {newVenue.address}, {newVenue.city}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    📍 {newVenue.latitude.toFixed(6)}, {newVenue.longitude.toFixed(6)}
                  </p>
                </div>
              )}

              {/* Capacity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={newVenue.capacity}
                  onChange={(e) => setNewVenue({ ...newVenue, capacity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 5000"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  💡 <strong>Tip:</strong> Start typing the address and select from the suggestions for accurate location.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowVenueModal(false);
                  setNewVenue({ name: '', address: '', city: '', capacity: '', latitude: 0, longitude: 0 });
                }}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateVenue}
                disabled={!newVenue.name || !newVenue.address || !newVenue.capacity || newVenue.latitude === 0}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Venue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CreateEventPage;