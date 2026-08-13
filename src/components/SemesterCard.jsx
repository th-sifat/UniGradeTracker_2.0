import React from 'react';
import { Trash2 } from 'lucide-react';

export default function SemesterCard({ semester, onDelete, onEdit }) {
  const { id, semesterName, gpa, courses } = semester;

  // Calculate total credits
  const totalCredits = courses.reduce((sum, course) => sum + course.credit, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden mb-6">
      <div className="p-5 md:p-6 flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{semesterName}</h3>
          <div className="flex items-center mt-1">
            <span className="text-slate-500 dark:text-slate-400 font-medium">SGPA: </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-1">{gpa.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(semester); }}
            className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-colors"
            title="Edit Semester"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(id); }}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            title="Delete Semester"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="px-5 md:px-6 pb-5 md:pb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">Course<br/>Code</th>
                <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">Title</th>
                <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider text-center">Credit</th>
                <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider text-center">Grade</th>
                <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider text-center">Point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="py-2.5 text-slate-800 dark:text-slate-200 font-bold text-sm whitespace-nowrap pr-4">
                    {course.courseCode || '-'}
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300 pr-4">
                    {course.courseTitle}
                  </td>
                  <td className="py-2.5 text-slate-800 dark:text-slate-200 font-medium text-center">
                    {course.credit}
                  </td>
                  <td className="py-2.5 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-sm min-w-[3rem]">
                      {course.grade === 'AUTO' && course.gradePoint != null && course.gradePoint !== '' ? (() => {
                        const p = parseFloat(course.gradePoint);
                        if (isNaN(p)) return 'AUTO';
                        if (p >= 4.0) return 'A+';
                        if (p >= 3.75) return 'A';
                        if (p >= 3.5) return 'A-';
                        if (p >= 3.25) return 'B+';
                        if (p >= 3.0) return 'B';
                        if (p >= 2.75) return 'B-';
                        if (p >= 2.5) return 'C+';
                        if (p >= 2.25) return 'C';
                        if (p >= 2.0) return 'D';
                        return 'F';
                      })() : course.grade}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400 font-medium text-center">
                    {course.gradePoint ? parseFloat(course.gradePoint).toFixed(2) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td colSpan="2" className="pt-4 pb-1 text-slate-800 dark:text-slate-200 font-bold">
                  Total Credits
                </td>
                <td className="pt-4 pb-1 text-slate-800 dark:text-slate-200 font-bold text-center">
                  {totalCredits}
                </td>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
