import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Calculator from './pages/Calculator.jsx';

const PrivateRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors`}>
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <main className="pb-20 md:pb-0">
            <Routes>
              <Route path="/" element={<Calculator />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/calculator" element={<Calculator />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
