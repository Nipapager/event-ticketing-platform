import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Footer from './components/layout/Footer';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import MyTicketsPage from './pages/MyTicketsPage';
import CreateEventPage from './pages/CreateEventPage';
import MyEventsPage from './pages/MyEventsPage';
import EditEventPage from './pages/EditEventPage';
import ProfilePage from './pages/ProfilePage';
import RequestOrganizerPage from './pages/RequestOrganizerPage';
import UserManagerPage from './pages/UserManagerPage';
import EventManagerPage from './pages/EventManagerPage';
import PastEventsPage from './pages/PastEventsPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import AdminOrdersPage from './pages/AdminOrdersPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} /> 
              <Route path="/my-tickets" element={<MyTicketsPage />} />
              <Route path="/create-event" element={<CreateEventPage />} />
              <Route path="/my-events" element={<MyEventsPage />} />
              <Route path="/admin/event-manager" element={<EventManagerPage />} />
              <Route path="/edit-event/:id" element={<EditEventPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/request-organizer" element={<RequestOrganizerPage />} />
              <Route path="/admin/user-manager" element={<UserManagerPage />} />
              <Route path="/past-events" element={<PastEventsPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/payment-cancel" element={<PaymentCancelPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
            </Routes>
          </main>
          <Footer />
        </div>

        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;