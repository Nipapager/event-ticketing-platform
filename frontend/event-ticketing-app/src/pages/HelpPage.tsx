import { useState } from 'react';
import { Link } from 'react-router-dom';

const HelpPage = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Help & Guide</h1>
          <p className="text-xl text-gray-600">Everything you need to know about EventSpot</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-800 mb-4">Quick Navigation</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => scrollToSection('getting-started')}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === 'getting-started'
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Getting Started
                </button>
                <button
                  onClick={() => scrollToSection('booking')}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === 'booking'
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Booking Tickets
                </button>
                <button
                  onClick={() => scrollToSection('organizer')}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === 'organizer'
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  For Organizers
                </button>
                <button
                  onClick={() => scrollToSection('payments')}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === 'payments'
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Payments & Billing
                </button>
                <button
                  onClick={() => scrollToSection('account')}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === 'account'
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Account Management
                </button>
                <button
                  onClick={() => scrollToSection('faq')}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === 'faq'
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  FAQ
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">

            {/* GETTING STARTED */}
            <section id="getting-started" className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                🚀 Getting Started
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Creating an Account</h3>
                  <p className="text-gray-700 mb-4">
                    All new users register as <strong>USER accounts</strong>. There is no role selection during registration.
                  </p>
                  
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li>Click <strong>"Register"</strong> in the top navigation</li>
                    <li>Fill in your information:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Full Name (required)</li>
                        <li>Email Address (required)</li>
                        <li>Password (required, minimum 6 characters)</li>
                        <li>Phone Number (optional)</li>
                        <li>Address (optional)</li>
                      </ul>
                    </li>
                    <li>Click <strong>"Register"</strong></li>
                    <li>You'll be redirected to the login page</li>
                    <li>Log in with your credentials</li>
                  </ol>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> All new accounts are USER accounts. To become an organizer, you must apply separately (see "For Organizers" section).
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Browsing Events</h3>
                  <p className="text-gray-700 mb-2">
                    You don't need an account to browse events! Anyone can:
                  </p>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                    <li>View all approved upcoming events on the <strong>Events</strong> page</li>
                    <li>Search events by title or description using the search bar</li>
                    <li>Filter events by:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>City location (major Greek cities)</li>
                        <li>Category (Bar, Stadium, Theater, Conference, Festival, Comedy, Classical, Exhibition, Workshop, Sports)</li>
                        <li>Date (Today, This Week, This Month, Any time)</li>
                        <li>Price range (€0 - €500)</li>
                      </ul>
                    </li>
                    <li>Sort events by: Relevance, Date, Price (Low to High), Price (High to Low)</li>
                    <li>View full event details including venue location on interactive map</li>
                    <li>See ticket types and pricing</li>
                    <li>Read reviews (for past events) or see organizer's past events (for upcoming events)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Navigation Overview</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Top Navigation Bar</h4>
                      <ul className="space-y-1 text-gray-700 list-disc list-inside ml-4">
                        <li><strong>Home:</strong> Landing page with featured events</li>
                        <li><strong>Events:</strong> Browse all upcoming approved events</li>
                        <li><strong>My Tickets:</strong> View your ticket orders (requires login)</li>
                        <li><strong>Past Events:</strong> Review events you've attended (requires login)</li>
                        <li><strong>Become Organizer:</strong> Apply for organizer status (USER accounts only)</li>
                        <li><strong>My Events:</strong> Manage your events (ORGANIZER/ADMIN only, top nav)</li>
                        <li><strong>Create Event:</strong> Create new event (ORGANIZER/ADMIN only, blue button in top nav)</li>
                        <li><strong>Admin:</strong> Admin management dropdown (ADMIN only)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">User Dropdown (Click your name)</h4>
                      <ul className="space-y-1 text-gray-700 list-disc list-inside ml-4">
                        <li><strong>Profile:</strong> View and edit your account information</li>
                        <li><strong>Logout:</strong> Sign out of your account</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* BOOKING TICKETS */}
            <section id="booking" className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                🎫 Booking Tickets
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Step-by-Step Booking Process</h3>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-600 pl-4">
                      <h4 className="font-bold text-gray-800 mb-2">1️⃣ Find Your Event</h4>
                      <ul className="text-gray-700 space-y-1 list-disc list-inside">
                        <li>Browse the <strong>Events</strong> page</li>
                        <li>Use search and filters to find events</li>
                        <li>Click on an event card to view full details</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-600 pl-4">
                      <h4 className="font-bold text-gray-800 mb-2">2️⃣ Review Event Details</h4>
                      <p className="text-gray-700">On the event details page, you can see:</p>
                      <ul className="text-gray-700 space-y-1 list-disc list-inside mt-2">
                        <li>Event description and details</li>
                        <li>Date, time, and venue location (with interactive map)</li>
                        <li>Available ticket types with descriptions and prices</li>
                        <li>Organizer information</li>
                        <li>Past events by the organizer (for upcoming events)</li>
                        <li>User reviews (for past events)</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-600 pl-4">
                      <h4 className="font-bold text-gray-800 mb-2">3️⃣ Select Tickets</h4>
                      <p className="text-gray-700 mb-2">
                        <strong>Desktop:</strong> Use the sidebar on the right
                      </p>
                      <p className="text-gray-700 mb-2">
                        <strong>Mobile:</strong> Use the sticky bar at the bottom
                      </p>
                      <ul className="text-gray-700 space-y-1 list-disc list-inside">
                        <li>Choose ticket type from dropdown</li>
                        <li>Adjust quantity using + and - buttons</li>
                        <li>View total price</li>
                        <li>Click <strong>"Book Now"</strong></li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-600 pl-4">
                      <h4 className="font-bold text-gray-800 mb-2">4️⃣ Login (if needed)</h4>
                      <p className="text-gray-700">
                        If you're not logged in, you'll be redirected to the login page. After logging in, you'll return to the event page.
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-600 pl-4">
                      <h4 className="font-bold text-gray-800 mb-2">5️⃣ Review Checkout</h4>
                      <p className="text-gray-700 mb-2">On the checkout page, verify:</p>
                      <ul className="text-gray-700 space-y-1 list-disc list-inside">
                        <li>Event details (title, date, venue)</li>
                        <li>Ticket type and quantity</li>
                        <li>Total price (€0.00 service fee)</li>
                        <li>Your contact information</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-600 pl-4">
                      <h4 className="font-bold text-gray-800 mb-2">6️⃣ Complete Payment</h4>
                      <ul className="text-gray-700 space-y-1 list-disc list-inside">
                        <li>Click <strong>"Proceed to Payment"</strong></li>
                        <li>You'll be redirected to secure Stripe checkout</li>
                        <li>Enter payment details</li>
                        <li>Complete the transaction</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-green-600 pl-4">
                      <h4 className="font-bold text-gray-800 mb-2">7️⃣ Receive Confirmation</h4>
                      <ul className="text-gray-700 space-y-1 list-disc list-inside">
                        <li>Immediate confirmation on success page</li>
                        <li>Order details with order number</li>
                        <li>Tickets appear in <strong>"My Tickets"</strong></li>
                        <li>QR codes generated for venue entry</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Managing Your Tickets</h3>
                  
                  <h4 className="font-semibold text-gray-800 mb-2">Accessing Your Tickets</h4>
                  <ul className="text-gray-700 space-y-1 list-disc list-inside ml-4 mb-4">
                    <li>Click <strong>"My Tickets"</strong> in the top navigation</li>
                    <li>Choose tab:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li><strong>Upcoming Events:</strong> Future events you've booked</li>
                        <li><strong>Past Events:</strong> Events that have already occurred</li>
                      </ul>
                    </li>
                  </ul>

                  <h4 className="font-semibold text-gray-800 mb-2">What You'll See</h4>
                  <p className="text-gray-700 mb-2">For each order:</p>
                  <ul className="text-gray-700 space-y-1 list-disc list-inside ml-4">
                    <li>Order number and date</li>
                    <li>Event details (title, date, time, venue)</li>
                    <li>Individual tickets with unique QR codes</li>
                    <li>Ticket type and quantity purchased</li>
                    <li>Total amount paid</li>
                    <li>Order status (CONFIRMED, PENDING, COMPLETED, CANCELLED)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Leaving Reviews</h3>
                  <p className="text-gray-700 mb-2">
                    Reviews can only be submitted for past events you attended:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li>Navigate to <strong>"Past Events"</strong> in the top navigation</li>
                    <li>Select the <strong>"Not Reviewed"</strong> tab to see events you haven't reviewed yet
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Only events you have purchased tickets for will appear</li>
                        <li>Events must be in the past (after event date)</li>
                      </ul>
                    </li>
                    <li>Click <strong>"Rate Event"</strong> for an event</li>
                    <li>Provide:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Rating (1-5 stars, required)</li>
                        <li>Written comment (optional)</li>
                      </ul>
                    </li>
                    <li>Click <strong>"Submit Review"</strong></li>
                    <li>Your review appears on the event details page</li>
                    <li>You can update your review anytime by clicking <strong>"Update Review"</strong> in the <strong>"Reviewed"</strong> tab</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* FOR ORGANIZERS */}
            <section id="organizer" className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                🎪 For Event Organizers
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-500">
                    1️⃣ Becoming an Organizer
                  </h3>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 font-semibold mb-2">
                      ⚠️ Important: Organizer status requires approval
                    </p>
                    <p className="text-yellow-700">
                      All new registrations create USER accounts. To become an organizer, you must apply via email and receive admin approval.
                    </p>
                  </div>

                  <h4 className="font-semibold text-gray-800 mb-3">How to Apply</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li>Log in to your USER account</li>
                    <li>Click <strong>"Become Organizer"</strong> in the top navigation</li>
                    <li>Read the requirements and benefits</li>
                    <li>Click the email button or send your application to: <strong className="text-blue-600">support@eventspot.com</strong></li>
                    <li>Include in your email:
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>Your full name and contact information</li>
                        <li>Business/Organization name (if applicable)</li>
                        <li>Proof of business registration or tax ID (for businesses)</li>
                        <li>Brief description of events you plan to organize</li>
                        <li>Links to previous events or social media (optional but recommended)</li>
                      </ul>
                    </li>
                    <li>Wait for admin review (typically 7 business days)</li>
                    <li>Receive approval notification</li>
                    <li>Start creating events!</li>
                  </ol>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-green-800">
                      <strong>💡 Tip:</strong> After approval, you'll see <strong>"My Events"</strong> and <strong>"Create Event"</strong> (blue button) appear in your top navigation bar!
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-500">
                    2️⃣ Creating Your First Event
                  </h3>
                  
                  <p className="text-gray-700 mb-4">
                    Once approved as an organizer, you can create events through the <strong>"Create Event"</strong> button (blue button in top navigation).
                  </p>

                  <h4 className="font-semibold text-gray-800 mb-3">Required Information</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Basic Information</h5>
                      <ul className="text-gray-700 space-y-1 list-disc list-inside ml-4">
                        <li><strong>Event Title:</strong> Clear, descriptive name</li>
                        <li><strong>Description:</strong> Detailed information about your event</li>
                        <li><strong>Category:</strong> Select from available categories or create new (Bar, Stadium, Theater, Conference, Festival, Comedy, Classical, Exhibition, Workshop, Sports)</li>
                        <li><strong>Venue:</strong> Select existing Greek venue or create new with map location</li>
                        <li><strong>Event Date:</strong> Must be in the future</li>
                        <li><strong>Event Time:</strong> Start time of the event</li>
                        <li><strong>Event Image:</strong> Choose from curated gallery images or provide custom URL</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Venue Creation</h5>
                      <p className="text-gray-700 mb-2">When creating a new venue:</p>
                      <ul className="text-gray-700 space-y-1 list-disc list-inside ml-4">
                        <li>Enter venue name</li>
                        <li>Type address and select from autocomplete suggestions (Nominatim API)</li>
                        <li>Or click on the interactive map to mark location (OpenStreetMap + Leaflet)</li>
                        <li>City and coordinates are automatically filled</li>
                        <li>Enter venue capacity</li>
                        <li>Location is verified with green confirmation</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Ticket Types (Required)</h5>
                      <p className="text-gray-700 mb-2">Every event must have at least one ticket type:</p>
                      <ul className="text-gray-700 space-y-1 list-disc list-inside ml-4">
                        <li><strong>Name:</strong> e.g., VIP, General Admission, Early Bird, Student</li>
                        <li><strong>Price:</strong> In euros (€), must be greater than 0</li>
                        <li><strong>Quantity:</strong> Total tickets available for this type</li>
                        <li><strong>Description:</strong> REQUIRED - Explain what's included, restrictions, or special conditions</li>
                      </ul>
                      <p className="text-sm text-gray-600 mt-2">
                        💡 Click <strong>"Add Ticket Type"</strong> to create multiple ticket tiers
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Image Gallery</h5>
                      <p className="text-gray-700 mb-2">Choose from professionally curated stock images:</p>
                      <ul className="text-gray-700 space-y-1 list-disc list-inside ml-4">
                        <li>Concert and music festival scenes</li>
                        <li>Conference and business events</li>
                        <li>Parties and DJ performances</li>
                        <li>Bar and nightlife venues</li>
                        <li>Theater and performing arts</li>
                        <li>Sports stadiums</li>
                      </ul>
                      <p className="text-sm text-gray-600 mt-2">
                        Or enter a custom image URL if you have your own event photo
                      </p>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-800 mb-3 mt-6">Submission and Approval</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li>Review all information carefully</li>
                    <li>Click <strong>"Create Event"</strong></li>
                    <li>Event is created with <strong>PENDING</strong> status</li>
                    <li>Admin reviews your event (typically 24-48 hours)</li>
                    <li>Once approved, event status changes to <strong>APPROVED</strong></li>
                    <li>Event becomes visible to all users</li>
                    <li>Users can start booking tickets</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-500">
                    3️⃣ Managing Your Events
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Accessing My Events</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        <li>Click <strong>"My Events"</strong> in the <strong>top navigation bar</strong> (not in dropdown!)</li>
                        <li>View all events you've created</li>
                        <li>Filter by status using tabs: ALL, PENDING, APPROVED, REJECTED, CANCELLED</li>
                        <li>See ticket sales and availability for each event</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Event Statuses</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-medium">PENDING</span>
                          <p className="text-sm text-gray-700 flex-1">
                            Awaiting admin approval. Not visible to users. You'll see: ⏳ "Your event is awaiting admin approval"
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">APPROVED</span>
                          <p className="text-sm text-gray-700 flex-1">
                            Live and visible to all users. Tickets can be purchased. Event appears in search and browsing.
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">REJECTED</span>
                          <p className="text-sm text-gray-700 flex-1">
                            Did not meet platform guidelines. You'll see: ❌ "This event was rejected by admin". Review and create a new event.
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">CANCELLED</span>
                          <p className="text-sm text-gray-700 flex-1">
                            Event has been cancelled. No further actions available.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Event Card Information</h4>
                      <p className="text-gray-700 mb-2">Each event card displays:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                        <li>Event image, title, and description</li>
                        <li>Date, time, and venue location</li>
                        <li>Status badge (color-coded)</li>
                        <li>Ticket types with availability shown as (sold/total), e.g., (45/100)</li>
                        <li>Action buttons: View Details, Edit Event, Cancel</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Available Actions</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                        <li><strong>View Details:</strong> See your event as users see it</li>
                        <li><strong>Edit Event:</strong> Modify event information (available if not cancelled)</li>
                        <li><strong>Cancel:</strong> Cancel the event (requires confirmation, not available for cancelled events)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-500">
                    4️⃣ Best Practices for Success
                  </h3>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <span className="text-purple-600 font-bold">✓</span>
                        <div>
                          <strong>Detailed Descriptions:</strong> Provide comprehensive event information including schedule, lineup, what to expect, and what's included
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-purple-600 font-bold">✓</span>
                        <div>
                          <strong>Accurate Venue Info:</strong> Double-check address and verify location on map before submitting
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-purple-600 font-bold">✓</span>
                        <div>
                          <strong>Clear Ticket Descriptions:</strong> Explain what each ticket type includes, any restrictions, and special conditions (REQUIRED field!)
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-purple-600 font-bold">✓</span>
                        <div>
                          <strong>High-Quality Images:</strong> Use attractive, relevant images from the gallery or provide custom URLs
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-purple-600 font-bold">✓</span>
                        <div>
                          <strong>Realistic Quantities:</strong> Set ticket quantities based on actual venue capacity
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-purple-600 font-bold">✓</span>
                        <div>
                          <strong>Competitive Pricing:</strong> Research similar events on the platform to price appropriately
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-purple-600 font-bold">✓</span>
                        <div>
                          <strong>Timely Updates:</strong> Use the Edit function to keep event information current and accurate
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-purple-600 font-bold">✓</span>
                        <div>
                          <strong>Monitor Analytics:</strong> Regularly check your dashboard to track sales and adjust strategy if needed
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* PAYMENTS & BILLING */}
            <section id="payments" className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                💳 Payments & Billing
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Payment Methods</h3>
                  <p className="text-gray-700 mb-4">
                    EventSpot uses <strong>Stripe</strong> for secure payment processing. We accept all major credit and debit cards.
                  </p>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                    <li>💳 Visa</li>
                    <li>💳 Mastercard</li>
                    <li>💳 American Express</li>
                    <li>💳 Discover</li>
                    <li>💳 Most debit cards with Visa/Mastercard logo</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-4">
                    All payment information is processed securely through Stripe. EventSpot never stores your complete card details.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Pricing & Fees</h3>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                    <li>All prices displayed in Euros (€)</li>
                    <li>Prices include all applicable taxes</li>
                    <li>No hidden fees - price shown is final price</li>
                    <li>Service fee: <strong>€0.00</strong> (currently waived)</li>
                    <li>Payment processed immediately upon confirmation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Order Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">CONFIRMED</span>
                      <p className="text-sm text-gray-700 flex-1">Payment successful, tickets issued, QR codes generated</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-medium">PENDING</span>
                      <p className="text-sm text-gray-700 flex-1">Payment being processed</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">COMPLETED</span>
                      <p className="text-sm text-gray-700 flex-1">Event has taken place</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">CANCELLED</span>
                      <p className="text-sm text-gray-700 flex-1">Order cancelled, refund processed</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Refunds & Cancellations</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 mb-2">
                      <strong>Note:</strong> Refund policies are determined by event organizers and may vary.
                    </p>
                    <ul className="text-sm text-yellow-800 space-y-1 ml-4">
                      <li>• Contact event organizer directly for refund requests</li>
                      <li>• Admins can process refunds through Order Manager system</li>
                      <li>• Automatic refunds for organizer-cancelled events</li>
                      <li>• Refunds typically processed within 5-10 business days</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Receipt & Invoices</h3>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                    <li>Order confirmation displayed immediately after successful payment</li>
                    <li>Order details available in "My Tickets" section</li>
                    <li>Each order includes:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Unique order number</li>
                        <li>Purchase date and time</li>
                        <li>Event details</li>
                        <li>Ticket breakdown</li>
                        <li>Total amount paid</li>
                        <li>Payment method</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* ACCOUNT MANAGEMENT */}
            <section id="account" className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                ⚙️ Account Management
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Profile Settings</h3>
                  <p className="text-gray-700 mb-2">Access your profile: Click your name (top-right) → "Profile"</p>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                    <li>Update your full name</li>
                    <li>View your email (cannot be changed)</li>
                    <li>Update phone number and address</li>
                    <li>View your account roles (USER, ORGANIZER, ADMIN)</li>
                    <li>Click "Edit Profile" button to make changes</li>
                    <li>Click "Save Changes" when done</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Account Roles</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">USER</span>
                        <h4 className="font-bold text-gray-800">Standard User</h4>
                      </div>
                      <p className="text-sm text-gray-700">Default role for all registrations. Can browse events, book tickets, and leave reviews.</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">ORGANIZER</span>
                        <h4 className="font-bold text-gray-800">Event Organizer</h4>
                      </div>
                      <p className="text-sm text-gray-700">Can create and manage events. Requires email application and admin approval. Has all USER privileges plus organizer features.</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">ADMIN</span>
                        <h4 className="font-bold text-gray-800">Administrator</h4>
                      </div>
                      <p className="text-sm text-gray-700">Full platform access. Can approve events, manage users, process refunds. Has all ORGANIZER and USER privileges.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Account Security Tips</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <ul className="space-y-2 text-blue-800">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">🔒</span>
                        <span>Use a strong, unique password (minimum 6 characters)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">🔒</span>
                        <span>Never share your password with anyone</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">🔒</span>
                        <span>Always log out from shared or public computers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">🔒</span>
                        <span>Regularly review your order history in "My Tickets"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">🔒</span>
                        <span>Contact support immediately if you notice unauthorized activity</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Logging Out</h3>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                    <li>Click your username in the top-right corner</li>
                    <li>Select "Logout" from dropdown menu</li>
                    <li>You'll be logged out and redirected to home page</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                ❓ Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Q: Do I need an account to browse events?</h3>
                  <p className="text-gray-700">
                    No! You can browse all events, view details, and see reviews without creating an account. However, 
                    you must be logged in to purchase tickets.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Q: How do I become an event organizer?</h3>
                  <p className="text-gray-700">
                    All new accounts are USER accounts by default. To become an organizer, click "Become Organizer" in the top navigation 
                    and send your application to <strong className="text-blue-600">support@eventspot.com</strong>. Include your business details and event plans. 
                    Approval typically takes 7 business days.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Q: Where can I see "My Events" and "Create Event" options?</h3>
                  <p className="text-gray-700">
                    After being approved as an organizer, you'll see "My Events" and "Create Event" (blue button) in the <strong>top navigation bar</strong>, 
                    not in your user dropdown menu.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Q: Can I purchase tickets for multiple events at once?</h3>
                  <p className="text-gray-700">
                    Currently, tickets must be purchased separately for each event. Each purchase generates a unique order 
                    with its own confirmation and QR codes.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Q: How do I receive my tickets after purchase?</h3>
                  <p className="text-gray-700">
                    Tickets are immediately available in "My Tickets" → "Upcoming Events" after successful payment. Each 
                    ticket includes a unique QR code for venue entry. You can view and enlarge QR codes anytime before the event.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Q: Can I cancel or modify my ticket purchase?</h3>
                  <p className="text-gray-700">
                    Refund and modification policies are set by individual event organizers. Contact the organizer directly 
                    or reach out to admin support for assistance. Admin can process refunds through the Order Manager system.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Q: When can I leave a review for an event?</h3>
                  <p className="text-gray-700">
                    Reviews can only be submitted after the event date has passed AND you have purchased tickets for that event. 
                    Go to "Past Events" in the top navigation, select the "Not Reviewed" tab, and click "Rate Event". You can update 
                    your review anytime from the "Reviewed" tab.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Q: How long does it take for my event to be approved?</h3>
                  <p className="text-gray-700">
                    Event approval typically takes 24-48 hours. Admins review all events to ensure quality and platform guidelines 
                    compliance. You'll be notified via the status badge on "My Events" page once your event is approved or if changes are needed.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Q: What happens if my payment fails?</h3>
                  <p className="text-gray-700">
                    If payment fails, you'll see an error message and no order will be created. Your tickets are not reserved 
                    during checkout. Please check your payment details and try again. If problems persist, contact your bank 
                    or try a different payment method.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Q: Can organizers purchase tickets for their own events?</h3>
                  <p className="text-gray-700">
                    Yes, organizers can purchase tickets for any event on the platform, including their own events. They have 
                    all user privileges in addition to organizer capabilities.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Q: Where can I see reviews for an event?</h3>
                  <p className="text-gray-700">
                    For <strong>upcoming events</strong>, you can see the organizer's past events on the event details page. 
                    For <strong>past events</strong>, user reviews are displayed sorted by rating (highest first). Reviews appear 
                    below the location section on the event details page.
                  </p>
                </div>

                <div className="pb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Q: How do I contact support?</h3>
                  <p className="text-gray-700">
                    For platform-related questions, technical issues, or organizer applications, email us at <strong className="text-blue-600">support@eventspot.com</strong>. 
                    For event-specific questions, contact the organizer directly through the event details page.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Support */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-8 text-white">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
                <p className="text-blue-100 mb-6 text-lg">
                  Our support team is here to assist you
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                  <a
                    href="mailto:support@eventspot.com"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Support
                  </a>
                  <Link
                    to="/request-organizer"
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Become an Organizer
                  </Link>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;