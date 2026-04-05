import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, Home } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 text-brand-600 hover:text-brand-700 transition">
            <BookOpen className="h-8 w-8" />
            <span className="font-extrabold text-xl tracking-tight">Learnify</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <Link to="/" className="hidden sm:flex items-center text-slate-600 hover:text-brand-600 font-medium px-3 py-2 rounded-md transition">
                  <Home className="h-4 w-4 mr-2" />
                  Feed
                </Link>
                <div className="px-3 py-2 text-sm font-medium text-slate-700 border-l border-slate-200 ml-2 pl-4 hidden sm:block">
                  {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-slate-600 hover:text-red-600 font-medium px-3 py-2 rounded-md transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
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
