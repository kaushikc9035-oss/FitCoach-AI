import React from 'react';
import { UserProfile, GeneratedPlan } from '../types';

interface DashboardHomeProps {
  user: UserProfile;
  plan: GeneratedPlan | null;
  onNavigate: (view: any) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ user, plan, onNavigate }) => {
  const bmi = (user.weight / ((user.height / 100) * (user.height / 100))).toFixed(1);
  const getBmiStatus = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Welcome back, {user.name}!</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-2">Here's your fitness overview for today</p>
        </div>
        <button 
          onClick={() => onNavigate('PROFILE')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
        >
          Edit Profile
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start justify-between relative overflow-hidden transition-colors">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Body Mass Index</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">{bmi}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{getBmiStatus(parseFloat(bmi))}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start justify-between transition-colors">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Current Weight</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">{user.weight} <span className="text-lg font-medium text-slate-400 dark:text-slate-500">kg</span></p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Height: {user.height} cm</p>
          </div>
           <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start justify-between transition-colors">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Fitness Goal</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{user.fitnessGoal}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start justify-between transition-colors">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Activity Level</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{user.activityLevel}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nutrition Summary */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
              <span className="text-green-500 dark:text-green-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </span>
              Today's Nutrition
            </h3>
            <button onClick={() => onNavigate('MEAL_PLAN')} className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">View Plan</button>
          </div>

          {plan ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Calories</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{plan.dietPlan.dailyMacros.totalCalories}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">kcal/day</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Protein</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{plan.dietPlan.dailyMacros.protein}g</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">per day</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Carbs</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{plan.dietPlan.dailyMacros.carbs}g</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">per day</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Fat</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{plan.dietPlan.dailyMacros.fats}g</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">per day</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500">No plan generated yet.</div>
          )}
        </div>

        {/* Workout Summary */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-full transition-colors">
           <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
              <span className="text-orange-500 dark:text-orange-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </span>
              Today's Workout
            </h3>
            <button onClick={() => onNavigate('WORKOUT_PLAN')} className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">View Plan</button>
          </div>

          {plan ? (
            <div className="space-y-4">
              {plan.workoutPlan.routine[0].exercises.slice(0, 3).map((ex, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl transition-colors">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{ex.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{ex.sets} {ex.reps ? `x ${ex.reps}` : ''}</p>
                  </div>
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                     {Math.floor(Math.random() * 50 + 20)} cal
                  </span>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-8 text-slate-400 dark:text-slate-500">No plan generated yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;