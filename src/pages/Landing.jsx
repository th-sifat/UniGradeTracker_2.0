import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { Calculator, LineChart, GraduationCap } from 'lucide-react';

export default function Landing() {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4">
          <GraduationCap className="w-4 h-4" />
          <span>The Modern Student Companion</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Track Your Academic <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
            Progress Effortlessly
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Calculate semester GPAs, monitor overall CGPA, and manage course grades with UniGradeTracker. Designed for students who want a clear picture of their academic standing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/signup" className="w-full sm:w-auto px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
            Get Started Free
          </Link>
          <Link to="/login" className="w-full sm:w-auto px-8 py-3 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium text-lg transition-all border border-slate-200 dark:border-slate-700 shadow-sm">
            Log In
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 text-left">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Smart GPA Calculator</h3>
            <p className="text-slate-600 dark:text-slate-400">Custom tailored calculations for standard 4.0 scales and specific systems like Daffodil International University.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <LineChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Visual Progression</h3>
            <p className="text-slate-600 dark:text-slate-400">Track your CGPA over time with beautiful, interactive charts that help you identify trends and set goals.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
