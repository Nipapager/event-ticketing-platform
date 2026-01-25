import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = !!user?.roles?.includes('ROLE_ADMIN');
  const isOrganizerOrAdmin = !!(user?.roles?.includes('ROLE_ORGANIZER') || isAdmin);
  const isPlainUser =
    !!user?.roles?.includes('ROLE_USER') &&
    !user?.roles?.includes('ROLE_ORGANIZER') &&
    !isAdmin;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinkClass = (to: string) => {
    const active = pathname === to;
    return `text-sm font-medium transition-colors ${
      active ? 'text-blue-700' : 'text-gray-700 hover:text-blue-600'
    }`;
  };

  const mobileLinkClass = (to: string) => {
    const active = pathname === to;
    return `block px-4 py-3 rounded-lg font-medium transition-colors ${
      active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
    }`;
  };

  const initials = useMemo(() => {
    const name = user?.name?.trim() || 'User';
    const parts = name.split(' ').filter(Boolean);
    const first = parts[0]?.[0] ?? 'U';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  }, [user?.name]);

  return (
    <nav className="bg-white/90 backdrop-blur shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold text-gray-900">EventSpot</div>
              <div className="text-[11px] text-gray-500 -mt-0.5">Tickets • Events • Memories</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">
            <Link to="/" className={navLinkClass('/')}>
              Home
            </Link>
            <Link to="/events" className={navLinkClass('/events')}>
              Events
            </Link>

            {/* Help visible to everyone */}
            <Link to="/help" className={navLinkClass('/help')}>
              Help
            </Link>

            {/* Admin-only dashboard */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/admin/dashboard'
                    ? 'text-blue-700'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Dashboard
              </Link>
            )}

            {/* Organizer-only dashboard */}
            {isOrganizerOrAdmin && !isAdmin && (
              <Link
                to="/organizer/dashboard"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/organizer/dashboard'
                    ? 'text-blue-700'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium text-sm">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* Primary actions (compact) */}
                <div className="flex items-center gap-4">
                  <Link to="/my-tickets" className={navLinkClass('/my-tickets')}>
                    My Tickets
                  </Link>

                  <Link to="/past-events" className={navLinkClass('/past-events')}>
                    Past Events
                  </Link>

                  {isPlainUser && (
                    <Link to="/request-organizer" className={navLinkClass('/request-organizer')}>
                      Become Organizer
                    </Link>
                  )}

                  {isOrganizerOrAdmin && (
                    <>
                      <Link to="/my-events" className={navLinkClass('/my-events')}>
                        My Events
                      </Link>
                      <Link
                        to="/create-event"
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                      >
                        Create Event
                      </Link>
                    </>
                  )}

                  {/* Admin dropdown */}
                  {isAdmin && (
                    <div className="relative group">
                      <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                        <span>Admin</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      <div className="absolute right-0 top-full pt-2 w-64 hidden group-hover:block z-10">
                        <div className="bg-white rounded-xl shadow-lg py-2 border border-gray-200 overflow-hidden">
                          <Link
                            to="/admin/dashboard"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            <div className="font-medium">Dashboard</div>
                            <div className="text-xs text-gray-500">Overview & KPIs</div>
                          </Link>

                          <div className="my-2 border-t" />

                          <Link
                            to="/admin/orders"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            <div className="font-medium">Order Manager</div>
                            <div className="text-xs text-gray-500">Manage and refund orders</div>
                          </Link>
                          <Link
                            to="/admin/event-manager"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            <div className="font-medium">Event Manager</div>
                            <div className="text-xs text-gray-500">Approve and manage events</div>
                          </Link>
                          <Link
                            to="/admin/user-manager"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            <div className="font-medium">User Manager</div>
                            <div className="text-xs text-gray-500">Manage user accounts</div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* User dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
                      {initials}
                    </div>
                    <div className="text-left leading-tight">
                      <div className="text-sm font-medium text-gray-900 max-w-[140px] truncate">
                        {user?.name || 'User'}
                      </div>
                      <div className="text-[11px] text-gray-500 max-w-[140px] truncate">
                        {user?.email}
                      </div>
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <div className="absolute right-0 top-full pt-2 w-52 hidden group-hover:block z-10">
                    <div className="bg-white rounded-xl shadow-lg py-2 border border-gray-200 overflow-hidden">
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                      <Link to="/help" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Help
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
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
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={closeMobileMenu} />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-xl z-50 md:hidden overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">Menu</div>
                  <div className="text-xs text-gray-500">Navigate EventSpot</div>
                </div>
              </div>
              <button onClick={closeMobileMenu} className="p-2 rounded-xl hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-3">
              {/* Main */}
              <div className="space-y-1">
                <Link to="/" onClick={closeMobileMenu} className={mobileLinkClass('/')}>
                  Home
                </Link>
                <Link to="/events" onClick={closeMobileMenu} className={mobileLinkClass('/events')}>
                  Events
                </Link>
                <Link to="/help" onClick={closeMobileMenu} className={mobileLinkClass('/help')}>
                  Help
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={closeMobileMenu}
                    className={mobileLinkClass('/admin/dashboard')}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>

              <div className="border-t my-2" />

              {/* Auth */}
              {!isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-center border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-center bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <>
                  {/* User Card */}
                  <div className="px-4 py-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center font-bold text-blue-700">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                        <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                      </div>
                    </div>

                    {user?.roles?.length ? (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {user.roles.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                          >
                            {role.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-1">
                    <Link to="/my-tickets" onClick={closeMobileMenu} className={mobileLinkClass('/my-tickets')}>
                      My Tickets
                    </Link>
                    <Link
                      to="/past-events"
                      onClick={closeMobileMenu}
                      className={mobileLinkClass('/past-events')}
                    >
                      Past Events
                    </Link>

                    {isPlainUser && (
                      <Link
                        to="/request-organizer"
                        onClick={closeMobileMenu}
                        className={mobileLinkClass('/request-organizer')}
                      >
                        Become an Organizer
                      </Link>
                    )}

                    {isOrganizerOrAdmin && (
                      <>
                        <div className="border-t my-2" />
                        <Link to="/my-events" onClick={closeMobileMenu} className={mobileLinkClass('/my-events')}>
                          My Events
                        </Link>
                        <Link
                          to="/organizer/dashboard"
                          onClick={closeMobileMenu}
                          className={mobileLinkClass('/organizer/dashboard')}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/create-event"
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium text-center"
                        >
                          Create Event
                        </Link>
                      </>
                    )}

                    {isAdmin && (
                      <>
                        <div className="border-t my-2" />
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Admin Management
                        </div>
                        <Link to="/admin/orders" onClick={closeMobileMenu} className={mobileLinkClass('/admin/orders')}>
                          Order Manager
                        </Link>
                        <Link
                          to="/admin/event-manager"
                          onClick={closeMobileMenu}
                          className={mobileLinkClass('/admin/event-manager')}
                        >
                          Event Manager
                        </Link>
                        <Link
                          to="/admin/user-manager"
                          onClick={closeMobileMenu}
                          className={mobileLinkClass('/admin/user-manager')}
                        >
                          User Manager
                        </Link>
                      </>
                    )}

                    <div className="border-t my-2" />

                    <Link to="/profile" onClick={closeMobileMenu} className={mobileLinkClass('/profile')}>
                      Profile
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
