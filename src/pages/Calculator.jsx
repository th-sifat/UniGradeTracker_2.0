import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Calculator() {
  const [system, setSystem] = useState(null); // 'diu' or 'standard'
  const [courses, setCourses] = useState([]);
  const [currentCGPA, setCurrentCGPA] = useState('');
  const [previousCredits, setPreviousCredits] = useState('');

  // Calculation helpers
  const getGradeFromMarks = (marks) => {
    if (marks >= 80) return { grade: 'A+', point: 4.00 };
    if (marks >= 75) return { grade: 'A', point: 3.75 };
    if (marks >= 70) return { grade: 'A-', point: 3.50 };
    if (marks >= 65) return { grade: 'B+', point: 3.25 };
    if (marks >= 60) return { grade: 'B', point: 3.00 };
    if (marks >= 55) return { grade: 'B-', point: 2.75 };
    if (marks >= 50) return { grade: 'C+', point: 2.50 };
    if (marks >= 45) return { grade: 'C', point: 2.25 };
    if (marks >= 40) return { grade: 'D', point: 2.00 };
    return { grade: 'F', point: 0.00 };
  };

  const calculateCourse = (course) => {
    if (system === 'standard') {
      return { ...course, grade: course.grade || 'AUTO' };
    }
    
    let totalMarks = 0;
    if (course.type === 'theory') {
      const att = parseFloat(course.attendance || 0);
      const attMarks = (att * 7) / 100;
      totalMarks = attMarks + parseFloat(course.quiz || 0) + parseFloat(course.assignment || 0) + parseFloat(course.presentation || 0) + parseFloat(course.midterm || 0) + parseFloat(course.final || 0);
    } else {
      const att = parseFloat(course.attendance || 0);
      const attMarks = (att * 10) / 100;
      totalMarks = attMarks + parseFloat(course.labReport || 0) + parseFloat(course.labPerformance || 0) + parseFloat(course.labFinal || 0);
    }
    
    const { grade, point } = getGradeFromMarks(totalMarks);
    return { ...course, grade, gradePoint: point };
  };

  const addCourse = (type = 'theory') => {
    setCourses([...courses, {
      id: Date.now(),
      type,
      courseTitle: '',
      courseCode: '',
      credit: '',
      gradePoint: '',
      grade: '',
      // Theory
      attendance: '', quiz: '', assignment: '', presentation: '', midterm: '', final: '',
      // Lab
      labReport: '', labPerformance: '', labFinal: ''
    }]);
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: value };
        return calculateCourse(updated);
      }
      return c;
    }));
  };

  const removeCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  // Calculations
  let currentSemCredits = 0;
  let currentSemPoints = 0;
  
  courses.forEach(c => {
    const cred = parseFloat(c.credit) || 0;
    const pt = parseFloat(c.gradePoint) || 0;
    currentSemCredits += cred;
    currentSemPoints += (pt * cred);
  });
  
  const sgpa = currentSemCredits > 0 ? (currentSemPoints / currentSemCredits).toFixed(2) : "0.00";
  
  let projectedCGPA = "0.00";
  const prevCGPA = parseFloat(currentCGPA) || 0;
  const prevCred = parseFloat(previousCredits) || 0;
  
  if (prevCred > 0 || currentSemCredits > 0) {
    const totalPts = (prevCGPA * prevCred) + currentSemPoints;
    const totalCrd = prevCred + currentSemCredits;
    projectedCGPA = (totalPts / totalCrd).toFixed(2);
  }

  if (!system) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center pt-24 px-4 bg-slate-50 dark:bg-slate-900">
        <h1 className="text-4xl md:text-[2.75rem] font-black text-[#1e293b] dark:text-white mb-4 tracking-tight">Select Your University System</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-14 text-lg">Choose your grading system to get started with the GPA calculator.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
          <button 
            onClick={() => setSystem('diu')}
            className="p-8 pt-10 rounded-3xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900 shadow-sm hover:shadow-md transition-all text-left relative overflow-hidden group min-h-[240px] flex flex-col"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 relative z-10 pr-8 leading-tight">Daffodil International<br/>University</h3>
            <p className="text-slate-500 dark:text-slate-400 relative z-10 text-[15px] leading-relaxed pr-4">Calculate based on DIU's specific theory and lab grading system, including attendance, presentation, and midterms.</p>
          </button>
          
          <button 
            onClick={() => setSystem('standard')}
            className="p-8 pt-10 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-900 shadow-sm hover:shadow-md transition-all text-left relative overflow-hidden group min-h-[240px] flex flex-col"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/30 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 relative z-10 mt-2">Other University</h3>
            <p className="text-slate-500 dark:text-slate-400 relative z-10 text-[15px] leading-relaxed pr-4 mt-2">Calculate using standard 4.0 scale credits and grade points for a generalized university experience.</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-10 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1e293b] dark:text-white">GPA Calculator</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-[15px]">Calculate your semester SGPA and see how it affects your overall CGPA.</p>
        </div>
        <button 
          onClick={() => setSystem(null)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change System</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[65%] space-y-6">
          {courses.map((course, index) => (
            <div key={course.id} className="bg-white dark:bg-slate-800 p-8 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-xl text-[#1e293b] dark:text-white capitalize">
                    {system === 'diu' ? `${course.type} Course` : 'Course'}
                  </h3>
                </div>
                <button 
                  onClick={() => removeCourse(course.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300 mb-2">Course Name</label>
                  <input type="text" value={course.courseTitle} onChange={e => updateCourse(course.id, 'courseTitle', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300 mb-2">Credits</label>
                  <input type="number" step="0.5" value={course.credit} onChange={e => updateCourse(course.id, 'credit', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none" />
                </div>
                
                {system === 'standard' && (
                  <div>
                    <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300 mb-2">Grade Point (0.0 - 4.0)</label>
                    <input type="number" step="0.01" value={course.gradePoint} onChange={e => updateCourse(course.id, 'gradePoint', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none" />
                  </div>
                )}
              </div>

              {system === 'diu' && course.type === 'theory' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300 mb-2">Attendance (%)</label>
                    <input type="number" value={course.attendance} onChange={e => updateCourse(course.id, 'attendance', e.target.value)} placeholder="0-100" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300 mb-2">Quiz (15)</label>
                    <input type="number" value={course.quiz} onChange={e => updateCourse(course.id, 'quiz', e.target.value)} placeholder="0-15" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300 mb-2">Assignment (5)</label>
                    <input type="number" value={course.assignment} onChange={e => updateCourse(course.id, 'assignment', e.target.value)} placeholder="0-5" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300 mb-2">Presentation (8)</label>
                    <input type="number" value={course.presentation} onChange={e => updateCourse(course.id, 'presentation', e.target.value)} placeholder="0-8" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300 mb-2">Midterm (25)</label>
                    <input type="number" value={course.midterm} onChange={e => updateCourse(course.id, 'midterm', e.target.value)} placeholder="0-25" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300 mb-2">Final Exam (40)</label>
                    <input type="number" value={course.final} onChange={e => updateCourse(course.id, 'final', e.target.value)} placeholder="0-40" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none" />
                  </div>
                </div>
              )}

              {system === 'diu' && course.type === 'lab' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300 mb-2">Attendance (%)</label>
                    <input type="number" value={course.attendance} onChange={e => updateCourse(course.id, 'attendance', e.target.value)} placeholder="0-100" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300 mb-2">Report (25)</label>
                    <input type="number" value={course.labReport} onChange={e => updateCourse(course.id, 'labReport', e.target.value)} placeholder="0-25" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300 mb-2">Performance (25)</label>
                    <input type="number" value={course.labPerformance} onChange={e => updateCourse(course.id, 'labPerformance', e.target.value)} placeholder="0-25" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300 mb-2">Final Exam (40)</label>
                    <input type="number" value={course.labFinal} onChange={e => updateCourse(course.id, 'labFinal', e.target.value)} placeholder="0-40" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none" />
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-4">
            {system === 'diu' ? (
              <>
                <button onClick={() => addCourse('theory')} className="flex-1 py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-3xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Add Theory Course
                </button>
                <button onClick={() => addCourse('lab')} className="flex-1 py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-3xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Add Lab Course
                </button>
              </>
            ) : (
              <button onClick={() => addCourse()} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-3xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Add Course
              </button>
            )}
          </div>
        </div>

        <div className="lg:w-[35%]">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-700 sticky top-24">
            <h3 className="font-bold text-xl text-[#1e293b] dark:text-white mb-2">CGPA Projection</h3>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">Enter your current academic standing to see how this semester affects your overall CGPA.</p>
            
            <div className="space-y-6 mb-10 pb-10 border-b border-slate-100 dark:border-slate-700">
              <div>
                <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300 mb-2">Current CGPA</label>
                <input type="number" step="0.01" value={currentCGPA} onChange={e => setCurrentCGPA(e.target.value)} placeholder="e.g. 3.50" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300 mb-2">Previous Credits Earned</label>
                <input type="number" value={previousCredits} onChange={e => setPreviousCredits(e.target.value)} placeholder="e.g. 60" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none" />
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Semester SGPA</h4>
                <div className="text-[3rem] leading-none font-black text-indigo-600 dark:text-indigo-400">{sgpa}</div>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Projected CGPA</h4>
                <div className="text-[3rem] leading-none font-black text-emerald-500 dark:text-emerald-400">{projectedCGPA}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
