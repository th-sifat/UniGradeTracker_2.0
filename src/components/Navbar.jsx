import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { GraduationCap, LayoutDashboard, Calculator, Moon, Sun, LogOut, LogIn, UserPlus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Navbar({ darkMode, setDarkMode }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const NavLink = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        )}
      >
        <Icon className="w-4 h-4" />
        <span className="hidden md:inline">{label}</span>
      </Link>
    );
  };

  return (
    <>
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight dark:text-white">UniGradeTracker</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              {user && (
                <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
              )}
              <Link
                to="/calculator"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                Calculator
              </Link>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {user ? (
                <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button onClick={logout} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-full transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                  <Link to="/login" className="text-sm font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-900/80 px-4 py-2 rounded-md transition-colors">
                    Login / Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {user ? (
            <>
              <Link to="/dashboard" className={cn("flex flex-col items-center p-2 rounded-lg", location.pathname === '/dashboard' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400")}>
                <LayoutDashboard className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">Dashboard</span>
              </Link>
              <Link to="/calculator" className={cn("flex flex-col items-center p-2 rounded-lg", location.pathname === '/calculator' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400")}>
                <Calculator className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">Calc</span>
              </Link>
              <button onClick={() => setDarkMode(!darkMode)} className="flex flex-col items-center p-2 rounded-lg text-slate-500 dark:text-slate-400">
                {darkMode ? <Sun className="w-6 h-6 mb-1" /> : <Moon className="w-6 h-6 mb-1" />}
                <span className="text-[10px] font-medium">Theme</span>
              </button>
              <button onClick={logout} className="flex flex-col items-center p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-500">
                <LogOut className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/" className={cn("flex flex-col items-center p-2 rounded-lg", location.pathname === '/' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400")}>
                <GraduationCap className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">Home</span>
              </Link>
              <button onClick={() => setDarkMode(!darkMode)} className="flex flex-col items-center p-2 rounded-lg text-slate-500 dark:text-slate-400">
                {darkMode ? <Sun className="w-6 h-6 mb-1" /> : <Moon className="w-6 h-6 mb-1" />}
                <span className="text-[10px] font-medium">Theme</span>
              </button>
              <Link to="/login" className="flex flex-col items-center p-2 rounded-lg text-slate-500 dark:text-slate-400">
                <LogIn className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">Login</span>
              </Link>
              <Link to="/signup" className="flex flex-col items-center p-2 rounded-lg text-slate-500 dark:text-slate-400">
                <UserPlus className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">Sign up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
