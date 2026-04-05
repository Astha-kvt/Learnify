import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import DoubtDetails from './pages/DoubtDetails';
import Leaderboard from './pages/Leaderboard';
import UserProfile from './pages/UserProfile';
import Tutors from './pages/Tutors';
import BookingsDashboard from './pages/BookingsDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <Toaster position="top-right" />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/doubts/:id" element={<DoubtDetails />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile/:id" element={<UserProfile />} />
              <Route path="/tutors" element={<Tutors />} />
              <Route path="/bookings" element={<BookingsDashboard />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
