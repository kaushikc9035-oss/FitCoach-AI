import React, { useState } from 'react';
import { WeightLog } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ProgressViewProps {
  logs: WeightLog[];
  currentWeight: number;
  onLogWeight: (weight: number) => void;
}

const ProgressView: React.FC<ProgressViewProps> = ({ logs, currentWeight, onLogWeight }) => {
  const [inputWeight, setInputWeight] = useState<string>('');
  
  const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Fitness is not about being better than someone else. It’s about being better than you were yesterday.",
    "Motivation is what gets you started. Habit is what keeps you going.",
    "Success starts with self-discipline.",
    "Don't stop when you're tired. Stop when you're done.",
    "Your body can stand almost anything. It’s your mind that you have to convince.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Sweat is just fat crying.",
    "A one hour workout is 4% of your day. No excuses."
  ];

  // Select a quote once on mount
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = parseFloat(inputWeight);
    if (!isNaN(weight) && weight > 0 && weight < 500) {
      onLogWeight(weight);
      setInputWeight('');
    }
  };

  // Prepare data for chart
  const chartData = logs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: log.date,
    weight: log.weight
  }));

  // Calculate stats
  const startWeight = logs.length > 0 ? logs[0].weight : currentWeight;
  const change = currentWeight - startWeight;
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <p className="text-lg font-bold text-slate-800 dark:text-white">
            {payload[0].value} <span className="text-sm font-normal">kg</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
         <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Progress Tracking</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor your weight journey</p>
         </div>
      </div>

      {/* Motivational Quote Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="relative z-10 flex items-start gap-4">
          <span className="text-4xl opacity-50 font-serif">"</span>
          <div>
            <p className="text-lg md:text-xl font-medium italic leading-relaxed">{quote}</p>
            <p className="text-indigo-200 text-sm mt-2 font-medium uppercase tracking-wide">— Daily Motivation</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
           <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Current Weight</p>
           <p className="text-3xl font-bold text-slate-800 dark:text-white">{currentWeight} <span className="text-lg text-slate-400">kg</span></p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
           <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Start Weight</p>
           <p className="text-3xl font-bold text-slate-800 dark:text-white">{startWeight} <span className="text-lg text-slate-400">kg</span></p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
           <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Change</p>
           <p className={`text-3xl font-bold ${change > 0 ? 'text-red-500' : 'text-green-500'}`}>
             {change > 0 ? '+' : ''}{change.toFixed(1)} <span className="text-lg opacity-60">kg</span>
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
           <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6">Weight History</h3>
           
           {chartData.length > 0 ? (
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                   <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      dy={10}
                   />
                   <YAxis 
                      domain={['auto', 'auto']} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                   />
                   <Tooltip content={<CustomTooltip />} />
                   <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                      activeDot={{ r: 6 }}
                   />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           ) : (
             <div className="h-[300px] flex items-center justify-center text-slate-400 dark:text-slate-500">
               No data available yet.
             </div>
           )}
        </div>

        {/* Log Input Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit transition-colors">
           <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Log Today's Weight</h3>
           <form onSubmit={handleLogSubmit}>
             <div className="mb-4">
               <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Weight (kg)</label>
               <input 
                 type="number" 
                 step="0.1"
                 placeholder="0.0"
                 className="w-full px-4 py-3 text-lg font-bold border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white transition"
                 value={inputWeight}
                 onChange={(e) => setInputWeight(e.target.value)}
                 required
               />
             </div>
             <button 
               type="submit"
               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95"
             >
               Save Entry
             </button>
           </form>
           
           <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3">Recent Logs</h4>
              <div className="space-y-3">
                {logs.slice().reverse().slice(0, 5).map((log, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{new Date(log.date).toLocaleDateString()}</span>
                    <span className="font-bold text-slate-800 dark:text-white">{log.weight} kg</span>
                  </div>
                ))}
                {logs.length === 0 && <p className="text-xs text-slate-400 italic">No logs recorded.</p>}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressView;