import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div className="p-8 text-center">Home Page (Coming soon)</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;