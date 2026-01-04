import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-gray-800">EventSpot</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/events" className="text-gray-700 hover:text-blue-600 font-medium">
              Events
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-tickets"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  My Tickets
                </Link>
                
                <Link
                  to="/past-events"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Past Events
                </Link>

                {user?.roles?.includes('ROLE_USER') && !user?.roles?.includes('ROLE_ORGANIZER') && !user?.roles?.includes('ROLE_ADMIN') && (
                  <Link
                    to="/request-organizer"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Become Organizer
                  </Link>
                )}

                {/* Admin Links */}
                {user?.roles?.includes('ROLE_ADMIN') && (
                  <>
                    <Link
                      to="/admin/event-manager"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Event Manager
                    </Link>
                    <Link
                      to="/admin/user-manager"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      User Manager
                    </Link>
                  </>
                )}

                {/* Organizer/Admin Links */}
                {user?.roles?.includes('ROLE_ORGANIZER') || user?.roles?.includes('ROLE_ADMIN') ? (
                  <>
                    <Link
                      to="/my-events"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      My Events
                    </Link>
                    <Link
                      to="/create-event"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Event
                    </Link>
                  </>
                ) : null}

                {/* User Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50">
                    <span>{user?.name || 'User'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-10">
                    <div className="bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileMenu}
          ></div>

          {/* Sidebar */}
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-lg z-50 md:hidden overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">

              {/* Main Navigation */}
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/events"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Events
                </Link>
              </div>

              {/* Divider */}
              <div className="border-t my-4"></div>

              {/* Auth Section */}
              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="px-4 py-3 bg-blue-50 rounded-lg mb-4">
                    <p className="font-semibold text-gray-800">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    {user?.roles && user.roles.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {user.roles.map(role => (
                          <span
                            key={role}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                          >
                            {role.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/my-tickets"
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      My Tickets
                    </Link>
                    
                    <Link
                      to="/past-events"
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Past Events
                    </Link>

                    {user?.roles?.includes('ROLE_USER') && !user?.roles?.includes('ROLE_ORGANIZER') && !user?.roles?.includes('ROLE_ADMIN') && (
                      <Link
                        to="/request-organizer"
                        onClick={closeMobileMenu}
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                      >
                        Become an Organizer
                      </Link>
                    )}

                    {/* Admin Links */}
                    {user?.roles?.includes('ROLE_ADMIN') && (
                      <>
                        <Link
                          to="/admin/event-manager"
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                        >
                          Event Manager
                        </Link>
                        <Link
                          to="/admin/user-manager"
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                        >
                          User Manager
                        </Link>
                      </>
                    )}

                    {/* Organizer Links */}
                    {(user?.roles?.includes('ROLE_ORGANIZER') || user?.roles?.includes('ROLE_ADMIN')) && (
                      <>
                        <Link
                          to="/my-events"
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                        >
                          My Events
                        </Link>
                        <Link
                          to="/create-event"
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium text-center"
                        >
                          Create Event
                        </Link>
                      </>
                    )}

                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-center border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-center bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;