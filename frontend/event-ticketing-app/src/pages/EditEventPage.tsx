import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import eventService from '../api/eventService';
import ticketTypeService from '../api/ticketTypeService';
import categoryService from '../api/categoryService';
import venueService from '../api/venueService';
import authService from '../api/authService';
import type { Category, Venue, Event } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface TicketType {
  id?: number;
  name: string;
  price: string;
  quantityAvailable: string;
  description: string;
}

const EditEventPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [event, setEvent] = useState<Event | null>(null);

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

  // Ticket types
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch event, categories, and venues in parallel
      const [eventData, categoriesData, venuesData] = await Promise.all([
        eventService.getEventById(Number(id)),
        categoryService.getAllCategories(),
        venueService.getAllVenues()
      ]);

      // Check if event can be edited
      if (eventData.status === 'CANCELLED') {
        toast.error('Cannot edit cancelled event');
        navigate('/my-events');
        return;
      }

      const eventDate = new Date(eventData.eventDate);
      if (eventDate < new Date()) {
        toast.error('Cannot edit past event');
        navigate('/my-events');
        return;
      }

      setEvent(eventData);
      setCategories(categoriesData);
      setVenues(venuesData);

      // Pre-fill form
      setFormData({
        title: eventData.title,
        description: eventData.description,
        categoryId: eventData.categoryId.toString(),
        venueId: eventData.venueId.toString(),
        eventDate: eventData.eventDate,
        eventTime: eventData.eventTime,
        imageUrl: eventData.imageUrl || ''
      });

      // Pre-fill ticket types
      if (eventData.ticketTypes && eventData.ticketTypes.length > 0) {
        setTicketTypes(
          eventData.ticketTypes.map(ticket => ({
            id: ticket.id,
            name: ticket.name,
            price: ticket.price.toString(),
            quantityAvailable: ticket.quantityAvailable.toString(),
            description: ticket.description || ''
          }))
        );
      }
    } catch (error: any) {
      console.error('Failed to load event:', error);
      toast.error(error.response?.data?.message || 'Failed to load event');
      navigate('/my-events');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleTicketTypeChange = (index: number, field: keyof TicketType, value: string) => {
    const updated = [...ticketTypes];
    updated[index] = { ...updated[index], [field]: value };
    setTicketTypes(updated);
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', price: '', quantityAvailable: '', description: '' }]);
  };

  const removeTicketType = async (index: number) => {
    const ticket = ticketTypes[index];

    // If ticket has ID, delete from backend
    if (ticket.id) {
      if (!window.confirm('Are you sure you want to delete this ticket type?')) return;

      try {
        await ticketTypeService.deleteTicketType(ticket.id);
        toast.success('Ticket type deleted successfully');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete ticket type');
        return;
      }
    }

    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
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
      if (!ticket.quantityAvailable || parseInt(ticket.quantityAvailable) <= 0)
        newErrors[`ticket_${index}_quantity`] = 'Valid quantity required';
      if (!ticket.description.trim()) newErrors[`ticket_${index}_description`] = 'Description required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    const toastId = toast.loading('Updating event...');

    try {
      // Update event
      await eventService.updateEvent(Number(id), {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        venueId: parseInt(formData.venueId)
      });

      // Update/Create ticket types
      await Promise.all(
        ticketTypes.map(ticket => {
          if (ticket.id) {
            // Update existing ticket
            return ticketTypeService.updateTicketType(ticket.id, {
              name: ticket.name,
              price: parseFloat(ticket.price),
              quantityAvailable: parseInt(ticket.quantityAvailable),
              description: ticket.description
            });
          } else {
            // Create new ticket
            return ticketTypeService.createTicketType(Number(id), {
              name: ticket.name,
              price: parseFloat(ticket.price),
              totalQuantity: parseInt(ticket.quantityAvailable),
              description: ticket.description
            });
          }
        })
      );

      toast.success('Event updated successfully!', { id: toastId });
      navigate('/my-events');
    } catch (error: any) {
      console.error('Failed to update event:', error);
      toast.error(error.response?.data?.message || 'Failed to update event', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading event..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Event</h1>
          <p className="text-gray-600">Update your event details</p>
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-red-600 text-sm mt-1">{errors.categoryId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Venue *
                  </label>
                  <select
                    name="venueId"
                    value={formData.venueId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select venue</option>
                    {venues.map(venue => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name} - {venue.city}
                      </option>
                    ))}
                  </select>
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

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
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
                    <h3 className="font-semibold text-gray-700">
                      {ticket.id ? `Ticket Type ${index + 1} (Existing)` : `Ticket Type ${index + 1} (New)`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeTicketType(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      {ticket.id ? 'Delete' : 'Remove'}
                    </button>
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
                        Available Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={ticket.quantityAvailable}
                        onChange={(e) => handleTicketTypeChange(index, 'quantityAvailable', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="100"
                      />
                      {errors[`ticket_${index}_quantity`] && (
                        <p className="text-red-600 text-xs mt-1">{errors[`ticket_${index}_quantity`]}</p>
                      )}
                    </div>
                  </div>

                  {/* Description Field - FULL WIDTH*/}
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
              onClick={() => navigate('/my-events')}
              className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;