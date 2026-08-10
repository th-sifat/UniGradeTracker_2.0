import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import SemesterCard from '../components/SemesterCard.jsx';
import CgpaChart from '../components/CgpaChart.jsx';
import AddSemesterModal from '../components/AddSemesterModal.jsx';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [semesterToDelete, setSemesterToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchSemesters();
    }
  }, [user]);

  const fetchSemesters = async () => {
    try {
      const q = query(collection(db, 'semesters'), where("userId", "==", user.id), orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setSemesters(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setSemesterToDelete(id);
  };

  const confirmDelete = async () => {
    if (!semesterToDelete) return;
    try {
      await deleteDoc(doc(db, 'semesters', semesterToDelete));
      setSemesters(semesters.filter(s => s.id !== semesterToDelete));
    } catch (err) {
      console.error(err);
    } finally {
      setSemesterToDelete(null);
    }
  };

  let totalCredits = 0;
  let totalGradePoints = 0;
  
  semesters.forEach(sem => {
    sem.courses.forEach(c => {
      totalCredits += c.credit;
      totalGradePoints += (c.gradePoint * c.credit);
    });
  });
  
  const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : "0.00";

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Welcome back, {user?.name.split(' ')[0]} <span className="text-xl">👋</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Here is your current academic performance summary.</p>
        </div>
        <button 
          onClick={() => {
            setEditingSemester(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add Semester</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-indigo-100 font-medium text-sm uppercase tracking-wider mb-1">Cumulative GPA</h3>
            <div className="text-5xl font-bold mb-4">{cgpa}</div>
            <div className="flex items-center gap-2 text-sm text-indigo-200">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              <span>Overall Performance</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-500 rounded-full opacity-50 blur-2xl"></div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wider mb-1">Total Credits</h3>
          <div className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{totalCredits}</div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, (totalCredits/140)*100)}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wider mb-1">Semesters</h3>
          <div className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{semesters.length}</div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (semesters.length/8)*100)}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">GPA Progression</h3>
        <CgpaChart data={semesters} />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Semester Records</h2>
        </div>
        
        {semesters.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 text-center border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">No semesters saved yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {semesters.map(sem => (
              <SemesterCard 
                key={sem.id} 
                semester={sem} 
                onDelete={handleDelete} 
                onEdit={(semester) => {
                  setEditingSemester(semester);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <AddSemesterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={fetchSemesters} 
        semesterToEdit={editingSemester}
      />

      {semesterToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Semester</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Are you sure you want to delete this semester record? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setSemesterToDelete(null)}
                className="px-4 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
