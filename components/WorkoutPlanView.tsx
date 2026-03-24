import React from 'react';
import { GeneratedPlan } from '../types';

interface WorkoutPlanViewProps {
  plan: GeneratedPlan | null;
  onGenerate: () => void;
  isLoading: boolean;
}

const WorkoutPlanView: React.FC<WorkoutPlanViewProps> = ({ plan, onGenerate, isLoading }) => {
  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12">
        <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-full mb-4">
          <svg className="w-10 h-10 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No Workout Plan Available</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Generate a routine tailored to your goals.</p>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="bg-orange-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-orange-700 transition disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>
    );
  }

  // Flatten the routine for a simple list view as per screenshot style
  const exercises = plan.workoutPlan.routine.flatMap(day => day.exercises);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Workout Plan</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Your personalized exercise routine</p>
        </div>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md shadow-orange-200 dark:shadow-none transition flex items-center gap-2"
        >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          {isLoading ? 'Generating...' : 'Generate New Plan'}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Your Workout Routine</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{exercises.length} exercises • Estimated 370 calories</p>
          </div>
          <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
             Generated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {exercises.map((exercise, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden p-6 flex gap-6 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-orange-500 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              {idx + 1}
            </div>
            
            <div className="flex-1">
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{exercise.name}</h4>
              <div className="flex gap-2 mb-4">
                 <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded">strength</span>
                 <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   {exercise.sets} sets
                 </span>
                 <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
                   {Math.floor(Math.random() * 50 + 20)} cal
                 </span>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Performance Notes:</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {exercise.notes || exercise.reps || "Perform with controlled movement. Focus on form over weight."}
                  <br/>
                  Target Reps: <span className="font-semibold text-slate-700 dark:text-slate-300">{exercise.reps}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlanView;