import React from 'react';
import { GeneratedPlan } from '../types';

interface MealPlanViewProps {
  plan: GeneratedPlan | null;
  onGenerate: () => void;
  isLoading: boolean;
}

const MealPlanView: React.FC<MealPlanViewProps> = ({ plan, onGenerate, isLoading }) => {
  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12">
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-4">
          <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No Meal Plan Available</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Generate your personalized nutrition guide to get started.</p>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>
    );
  }

  const { dailyMacros, sampleDay } = plan.dietPlan;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Meal Plan</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Your personalized nutrition guide</p>
        </div>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md shadow-green-200 dark:shadow-none transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          {isLoading ? 'Generating...' : 'Generate New Plan'}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Daily Nutrition Targets</h3>
          <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
             Generated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-xl border border-orange-100 dark:border-orange-900/30">
             <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Calories</p>
             <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{dailyMacros.totalCalories}</p>
             <p className="text-xs text-slate-400 dark:text-slate-500">kcal/day</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
             <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Protein</p>
             <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{dailyMacros.protein}</p>
             <p className="text-xs text-slate-400 dark:text-slate-500">grams/day</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-100 dark:border-green-900/30">
             <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Carbs</p>
             <p className="text-3xl font-bold text-green-600 dark:text-green-400">{dailyMacros.carbs}</p>
             <p className="text-xs text-slate-400 dark:text-slate-500">grams/day</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-100 dark:border-purple-900/30">
             <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Fat</p>
             <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{dailyMacros.fats}</p>
             <p className="text-xs text-slate-400 dark:text-slate-500">grams/day</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => {
          // @ts-ignore
          const items = sampleDay[mealType] || [];
          if (items.length === 0) return null;
          
          const totalCals = items.reduce((acc: number, item: any) => acc + item.calories, 0);
          
          // Calculate macros for this specific meal
          let mealProtein = items.reduce((acc: number, item: any) => acc + (item.protein || 0), 0);
          let mealCarbs = items.reduce((acc: number, item: any) => acc + (item.carbs || 0), 0);
          let mealFats = items.reduce((acc: number, item: any) => acc + (item.fats || 0), 0);

          // Fallback estimation if specific macros aren't present (backward compatibility for old plans)
          if (mealProtein === 0 && dailyMacros.totalCalories > 0) {
            const ratio = totalCals / dailyMacros.totalCalories;
            mealProtein = Math.floor(dailyMacros.protein * ratio);
            mealCarbs = Math.floor(dailyMacros.carbs * ratio);
            mealFats = Math.floor(dailyMacros.fats * ratio);
          }
          
          return (
            <div key={mealType} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
               <div className="p-6">
                 <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-md
                        ${mealType === 'breakfast' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                          mealType === 'lunch' ? 'bg-gradient-to-br from-green-400 to-teal-500' :
                          mealType === 'dinner' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' :
                          'bg-gradient-to-br from-purple-400 to-pink-500'
                        }`}>
                        {mealType === 'breakfast' ? '🍳' : mealType === 'lunch' ? '🥗' : mealType === 'dinner' ? '🍽️' : '🍎'}
                      </div>
                      <div>
                        <h4 className="capitalize font-bold text-lg text-slate-800 dark:text-white">{mealType}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{items.map((i: any) => i.name).join(', ')}</p>
                      </div>
                   </div>
                   <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold px-3 py-1 rounded-lg text-sm">
                     {totalCals} kcal
                   </span>
                 </div>

                 {/* Macro breakdown for the meal */}
                 <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-center">
                       <p className="text-xs text-slate-500 dark:text-slate-400">Protein</p>
                       <p className="font-bold text-blue-600 dark:text-blue-400">{Math.round(mealProtein)}g</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
                       <p className="text-xs text-slate-500 dark:text-slate-400">Carbs</p>
                       <p className="font-bold text-green-600 dark:text-green-400">{Math.round(mealCarbs)}g</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg text-center">
                       <p className="text-xs text-slate-500 dark:text-slate-400">Fat</p>
                       <p className="font-bold text-purple-600 dark:text-purple-400">{Math.round(mealFats)}g</p>
                    </div>
                 </div>
                 
                 <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                   <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ingredients & Details:</p>
                   <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                     {items.map((item: any, idx: number) => (
                       <li key={idx}>{item.description}</li>
                     ))}
                   </ul>
                 </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealPlanView;