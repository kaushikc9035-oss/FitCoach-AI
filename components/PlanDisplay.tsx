import React from 'react';
import { GeneratedPlan, UserProfile } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PlanDisplayProps {
  plan: GeneratedPlan;
  user: UserProfile;
  onReset: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, user, onReset }) => {
  const macroData = [
    { name: 'Protein', value: plan.dietPlan.dailyMacros.protein },
    { name: 'Carbs', value: plan.dietPlan.dailyMacros.carbs },
    { name: 'Fats', value: plan.dietPlan.dailyMacros.fats },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border-l-8 border-blue-600 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Hello, {user.name}!</h1>
          <p className="text-slate-500 mt-2 text-lg">Here is your personalized roadmap to {user.fitnessGoal.toLowerCase()}.</p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <div className="text-sm text-slate-400">Target Calories</div>
          <div className="text-4xl font-black text-blue-600">{plan.dietPlan.dailyMacros.totalCalories} kcal</div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="text-indigo-800 font-bold mb-2 flex items-center gap-2">
          <span>💡</span> Coach's Summary
        </h3>
        <p className="text-indigo-900 leading-relaxed">{plan.summary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Diet Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
          <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Nutrition Plan
            </h3>
          </div>
          
          <div className="p-6 flex-1 flex flex-col gap-6">
             {/* Macros Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center text-sm text-slate-500 mt-[-10px]">Macro Breakdown (g)</div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-slate-700 border-b pb-2">Sample Day</h4>
              
              {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => (
                <div key={mealType} className="bg-slate-50 p-4 rounded-xl">
                   <h5 className="capitalize font-bold text-slate-600 text-sm mb-2">{mealType}</h5>
                   <ul className="space-y-2">
                    {/* @ts-ignore */}
                     {plan.dietPlan.sampleDay[mealType].map((item: any, idx: number) => (
                       <li key={idx} className="text-sm text-slate-700 flex justify-between">
                         <span>{item.name} <span className="text-xs text-slate-400 block">{item.description}</span></span>
                         <span className="font-mono text-xs font-bold bg-white px-2 py-1 rounded border">{item.calories} kcal</span>
                       </li>
                     ))}
                   </ul>
                </div>
              ))}
            </div>
            
             <div className="bg-blue-50 p-4 rounded-xl mt-auto">
              <span className="font-bold text-blue-700 text-sm">💧 Hydration:</span>
              <p className="text-sm text-blue-800 mt-1">{plan.dietPlan.hydrationTips}</p>
            </div>
          </div>
        </div>

        {/* Workout Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
          <div className="bg-orange-500 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Workout Plan
            </h3>
            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">{plan.workoutPlan.frequency}</span>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="space-y-6">
              {plan.workoutPlan.routine.map((day, idx) => (
                <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700 text-sm">
                    {day.dayName}
                  </div>
                  <div className="divide-y divide-slate-100">
                    {day.exercises.map((exercise, eIdx) => (
                      <div key={eIdx} className="p-4 hover:bg-slate-50 transition">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-slate-800">{exercise.name}</span>
                          <span className="text-xs font-mono bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                            {exercise.sets} x {exercise.reps}
                          </span>
                        </div>
                        {exercise.notes && <p className="text-xs text-slate-500 italic">{exercise.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-8">
        <button 
          onClick={onReset}
          className="text-slate-500 hover:text-slate-800 font-medium underline transition"
        >
          Start Over with New Profile
        </button>
      </div>
    </div>
  );
};

export default PlanDisplay;