import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  House, 
  MagnifyingGlass, 
  PencilSimple, 
  User,
  SignOut
} from '@phosphor-icons/react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-2 py-2 rou nded-full bg-zinc-900/50 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
        
        {/* Brand */}
        <Link to="/" className="px-5 py-2">
           <span className="font-serif italic font-bold text-white tracking-tight">Vital Logs</span>
        </Link>

        {/* Separator */}
        <div className="w-px h-5 bg-white/10"></div>

        {/* Navigation Links */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className={`px-4 py-2 text-xs font-medium tracking-widest uppercase transition-colors rounded-full ${isActive('/') ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-white'}`}
          >
            Home
          </Link>
          <Link 
            to={isAuthenticated ? "/dashboard" : "/login"}
            className={`px-4 py-2 text-xs font-medium tracking-widest uppercase transition-colors rounded-full ${isActive('/dashboard') ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-white'}`}
          >
            Explore
          </Link>
          {isAuthenticated && (
            <Link 
              to="/create" 
              className={`px-4 py-2 text-xs font-medium tracking-widest uppercase transition-colors rounded-full ${isActive('/create') ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-white'}`}
            >
              Write
            </Link>
          )}
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-white/10"></div>

        {/* Auth Actions */}
        <div className="flex items-center gap-1 px-1">
          {isAuthenticated ? (
            <>
              <Link 
                to="/profile" 
                className={`p-2.5 rounded-full transition-all ${isActive('/profile') ? 'bg-white text-zinc-900' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                aria-label="Profile"
              >
                <User weight={isActive('/profile') ? 'fill' : 'regular'} size={18} />
              </Link>
              <button 
                onClick={handleLogout} 
                className="p-2.5 rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                aria-label="Sign Out"
              >
                <SignOut weight="regular" size={18} />
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-2 text-xs font-medium tracking-widest uppercase bg-white text-zinc-900 rounded-full hover:bg-zinc-200 transition-colors"
            >
              Log In
            </Link>
          )}
        </div>

      </div>
    </div>
  );
};

export default Navbar;