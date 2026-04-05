import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, Home, User as UserIcon, Calendar, Trophy, Users } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 text-brand-600 hover:text-brand-700 transition">
            <BookOpen className="h-8 w-8" />
            <span className="font-extrabold text-xl tracking-tight hidden sm:block">Learnify</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {user ? (
              <>
                <Link to="/" className="flex items-center text-slate-600 hover:text-brand-600 font-medium px-2 py-2 rounded-md transition text-sm sm:text-base">
                  <Home className="h-4 w-4 sm:mr-1" />
                  <span className="hidden lg:block">Feed</span>
                </Link>
                <Link to="/leaderboard" className="flex items-center text-slate-600 hover:text-brand-600 font-medium px-2 py-2 rounded-md transition text-sm sm:text-base">
                  <Trophy className="h-4 w-4 sm:mr-1" />
                  <span className="hidden lg:block">Leaderboard</span>
                </Link>
                <Link to="/tutors" className="flex items-center text-slate-600 hover:text-brand-600 font-medium px-2 py-2 rounded-md transition text-sm sm:text-base">
                  <Users className="h-4 w-4 sm:mr-1" />
                  <span className="hidden lg:block">Tutors</span>
                </Link>
                <Link to="/bookings" className="flex items-center text-slate-600 hover:text-brand-600 font-medium px-2 py-2 rounded-md transition text-sm sm:text-base">
                  <Calendar className="h-4 w-4 sm:mr-1" />
                  <span className="hidden lg:block">Bookings</span>
                </Link>
                <div className="border-l border-slate-200 ml-1 pl-1 sm:ml-2 sm:pl-3 flex items-center">
                  <Link to={`/profile/${user._id}`} className="flex items-center text-slate-700 hover:text-brand-600 font-bold px-2 py-2 text-sm">
                    <UserIcon className="h-4 w-4 sm:mr-1" />
                    <span className="hidden md:block">{user.name}</span>
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-slate-600 hover:text-red-600 font-medium px-3 py-2 rounded-md transition hover:bg-red-50 ml-1 text-sm sm:text-base"
                >
                  <LogOut className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-brand-600 font-medium px-3 py-2 rounded-md transition">
                  Login
                </Link>
                <Link to="/register" className="bg-brand-500 text-white hover:bg-brand-600 font-medium px-4 py-2 rounded-md shadow-sm transition">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
