import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    university: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="mt-1">
                <input
                  type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
              <div className="mt-1">
                <input
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">University (Optional)</label>
              <div className="mt-1">
                <input
                  type="text" name="university" value={formData.university} onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-slate-700 dark:text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit" disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
