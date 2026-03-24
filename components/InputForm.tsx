import React, { useState, useEffect } from 'react';
import { UserProfile, Gender, ActivityLevel, FitnessGoal, FoodPreference } from '../types';

interface InputFormProps {
  initialData?: UserProfile | null;
  draftEmail?: string;
  onSubmit: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ initialData, draftEmail, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: Gender.Male,
    activityLevel: ActivityLevel.Sedentary,
    fitnessGoal: FitnessGoal.LoseWeight,
    foodPreference: FoodPreference.NonVeg,
    healthIssues: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email,
        name: initialData.name,
        age: initialData.age.toString(),
        height: initialData.height.toString(),
        weight: initialData.weight.toString(),
        gender: initialData.gender,
        activityLevel: initialData.activityLevel,
        fitnessGoal: initialData.fitnessGoal,
        foodPreference: initialData.foodPreference,
        healthIssues: initialData.healthIssues || ''
      });
    } else if (draftEmail) {
      setFormData(prev => ({ ...prev, email: draftEmail }));
    }
  }, [initialData, draftEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      email: formData.email,
      name: formData.name,
      age: parseInt(formData.age),
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
      gender: formData.gender as Gender,
      activityLevel: formData.activityLevel as ActivityLevel,
      fitnessGoal: formData.fitnessGoal as FitnessGoal,
      foodPreference: formData.foodPreference as FoodPreference,
      healthIssues: formData.healthIssues
    });
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{initialData ? 'Edit Your Profile' : 'Create Your Profile'}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Help us personalize your fitness journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <h3 className="font-bold text-slate-800 dark:text-white">Personal Information</h3>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address *</label>
              <input
                required
                name="email"
                type="email"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                value={formData.email}
                readOnly
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Your ID for signing in.</p>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name *</label>
              <input
                required
                name="name"
                type="text"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex. John Doe"
              />
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Age *</label>
              <input
                required
                name="age"
                type="number"
                min="14"
                max="100"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

             <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Height (cm) *</label>
              <input
                required
                name="height"
                type="number"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                value={formData.height}
                onChange={handleChange}
              />
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Weight (kg) *</label>
              <input
                required
                name="weight"
                type="number"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Gender *</label>
              <select
                name="gender"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition"
                value={formData.gender}
                onChange={handleChange}
              >
                {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Goals & Activity Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <h3 className="font-bold text-slate-800 dark:text-white">Fitness Goals & Activity</h3>
          </div>
          
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Fitness Goal *</label>
              <select
                name="fitnessGoal"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition"
                value={formData.fitnessGoal}
                onChange={handleChange}
              >
                {Object.values(FitnessGoal).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Activity Level</label>
                <select
                  name="activityLevel"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition"
                  value={formData.activityLevel}
                  onChange={handleChange}
                >
                  {Object.values(ActivityLevel).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
               <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Diet Preference</label>
                <select
                  name="foodPreference"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition"
                  value={formData.foodPreference}
                  onChange={handleChange}
                >
                  {Object.values(FoodPreference).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

             <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Health Issues / Injuries (Optional)</label>
              <textarea
                name="healthIssues"
                rows={2}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none transition bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                placeholder="e.g., Lower back pain, lactose intolerance..."
                value={formData.healthIssues}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`py-4 px-8 rounded-xl text-white font-bold text-lg shadow-lg transform transition hover:-translate-y-1 ${
              isLoading 
              ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 hover:shadow-blue-500/30'
            }`}
          >
            {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Complete Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;