import React, { useState, useEffect, useContext } from 'react';
import { X, Plus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function AddSemesterModal({ isOpen, onClose, onSave, semesterToEdit }) {
  const { user } = useContext(AuthContext);
  const [semesterName, setSemesterName] = useState('Spring');
  const [semesterYear, setSemesterYear] = useState(new Date().getFullYear());
  const [courses, setCourses] = useState([
    { id: Date.now(), courseCode: '', courseTitle: '', credit: '', grade: 'AUTO', gradePoint: '' }
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && semesterToEdit) {
      const [name, year] = semesterToEdit.semesterName.split(' ');
      setSemesterName(name);
      setSemesterYear(year || new Date().getFullYear());
      setCourses(semesterToEdit.courses.map(c => ({
        ...c,
        id: c.id || Date.now() + Math.random()
      })));
    } else if (isOpen) {
      setSemesterName('Spring');
      setSemesterYear(new Date().getFullYear());
      setCourses([{ id: Date.now(), courseCode: '', courseTitle: '', credit: '', grade: 'AUTO', gradePoint: '' }]);
    }
  }, [isOpen, semesterToEdit]);

  if (!isOpen) return null;

  const handleAddCourse = () => {
    setCourses([...courses, { id: Date.now(), courseCode: '', courseTitle: '', credit: '', grade: 'AUTO', gradePoint: '' }]);
  };

  const handleRemoveCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        const newCourse = { ...c, [field]: value };
        return newCourse;
      }
      return c;
    }));
  };

  const handleSave = async () => {
    const validCourses = courses.filter(c => {
      const credit = parseFloat(c.credit);
      const gp = parseFloat(c.gradePoint);
      return c.courseTitle && !isNaN(credit) && !isNaN(gp);
    });

    if (validCourses.length === 0) {
      alert("Please fill in at least one course details completely.");
      return;
    }
    
    setSaving(true);
    let totalCredits = 0;
    let totalPoints = 0;
    validCourses.forEach(c => {
      totalCredits += parseFloat(c.credit);
      totalPoints += (parseFloat(c.credit) * parseFloat(c.gradePoint));
    });
    
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    const semNameStr = `${semesterName} ${semesterYear}`;

    try {
      const isEditing = !!semesterToEdit;
      const data = {
        userId: user.id,
        semesterName: semNameStr,
        gpa: parseFloat(gpa),
        courses: validCourses.map(c => ({
          courseCode: c.courseCode || '',
          courseTitle: c.courseTitle,
          credit: parseFloat(c.credit),
          grade: c.grade || 'AUTO',
          gradePoint: parseFloat(c.gradePoint),
          id: c.id
        }))
      };

      if (isEditing) {
        await updateDoc(doc(db, 'semesters', semesterToEdit.id), data);
      } else {
        data.createdAt = serverTimestamp();
        await addDoc(collection(db, 'semesters'), data);
      }
      
      onSave(); // Refresh dashboard data
      onClose();
      // Reset form
      setSemesterName('Spring');
      setSemesterYear(new Date().getFullYear());
      setCourses([{ id: Date.now(), courseCode: '', courseTitle: '', credit: '', grade: 'AUTO', gradePoint: '' }]);
    } catch (err) {
      console.error(err);
      alert(`Error ${semesterToEdit ? 'updating' : 'saving'} semester: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {semesterToEdit ? 'Edit Semester Result' : 'Add Semester Result'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <div className="mb-6">
            <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2">Semester Name</label>
            <div className="flex gap-4">
              <select 
                value={semesterName} 
                onChange={e => setSemesterName(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none"
              >
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
              </select>
              <select 
                value={semesterYear} 
                onChange={e => setSemesterYear(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none"
              >
                {Array.from({ length: 101 }, (_, i) => 2000 + i).map(year => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">COURSES</label>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Code" 
                    value={course.courseCode}
                    onChange={e => updateCourse(course.id, 'courseCode', e.target.value)}
                    className="w-24 px-3 py-2.5 text-sm bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Course Title" 
                    value={course.courseTitle}
                    onChange={e => updateCourse(course.id, 'courseTitle', e.target.value)}
                    className="flex-1 px-3 py-2.5 text-sm bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none"
                  />
                  <input 
                    type="number" 
                    placeholder="Credit" 
                    step="0.5"
                    value={course.credit}
                    onChange={e => updateCourse(course.id, 'credit', e.target.value)}
                    className="w-24 px-3 py-2.5 text-sm bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Grade" 
                    value={course.grade}
                    onChange={e => updateCourse(course.id, 'grade', e.target.value)}
                    className="w-24 px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-xl text-center font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none"
                  />
                  <input 
                    type="number" 
                    placeholder="Point (4.00)" 
                    step="0.01"
                    value={course.gradePoint}
                    onChange={e => updateCourse(course.id, 'gradePoint', e.target.value)}
                    className="w-28 px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-xl text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none"
                  />
                  {courses.length > 1 && (
                    <button
                      onClick={() => handleRemoveCourse(course.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors shrink-0 flex items-center justify-center"
                      title="Remove Course"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={handleAddCourse}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Another Course
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Semester'}
          </button>
        </div>
      </div>
    </div>
  );
}
