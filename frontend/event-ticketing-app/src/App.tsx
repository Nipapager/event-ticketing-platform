import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Footer from './components/layout/Footer';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentConfirmationPage from './pages/PaymentConfirmationPage';
import MyTicketsPage from './pages/MyTicketsPage';
import CreateEventPage from './pages/CreateEventPage';
import MyEventsPage from './pages/MyEventsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import EditEventPage from './pages/EditEventPage';

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
              <Route path="/payment-confirmation" element={<PaymentConfirmationPage />} />
              <Route path="/my-tickets" element={<MyTicketsPage />} />
              <Route path="/create-event" element={<CreateEventPage />} />
              <Route path="/my-events" element={<MyEventsPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/edit-event/:id" element={<EditEventPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;