import React from 'react';
import { UserProfile, FitnessGoal } from '../types';

interface AdminDashboardProps {
  users: UserProfile[];
  onDelete: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, onDelete }) => {
  const [filter, setFilter] = React.useState<FitnessGoal | 'All'>('All');

  const filteredUsers = filter === 'All' 
    ? users 
    : users.filter(u => u.fitnessGoal === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
           <p className="text-slate-500">Manage users and generated plans</p>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-sm font-medium text-slate-600">Filter by Goal:</span>
           <select 
             className="px-3 py-2 border rounded-lg bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
             value={filter}
             onChange={(e) => setFilter(e.target.value as any)}
           >
             <option value="All">All Goals</option>
             {Object.values(FitnessGoal).map(g => <option key={g} value={g}>{g}</option>)}
           </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Goal</th>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4">Date Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No users found based on current filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.age} yrs • {user.gender} • {user.weight}kg
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium
                        ${user.fitnessGoal === FitnessGoal.LoseWeight ? 'bg-red-100 text-red-700' : 
                          user.fitnessGoal === FitnessGoal.GainMuscle ? 'bg-blue-100 text-blue-700' : 
                          'bg-green-100 text-green-700'}`}>
                        {user.fitnessGoal}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.activityLevel}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onDelete(user.id)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm transition hover:bg-red-50 px-3 py-1 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;