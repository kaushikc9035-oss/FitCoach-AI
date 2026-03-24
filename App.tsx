import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import MealPlanView from './components/MealPlanView';
import WorkoutPlanView from './components/WorkoutPlanView';
import ProgressView from './components/ProgressView';
import InputForm from './components/InputForm';
import Login from './components/Login';
import { UserProfile, GeneratedPlan } from './types';
import { generateFitnessPlan } from './services/geminiService';

type ViewState = 'LOGIN' | 'DASHBOARD' | 'PROFILE' | 'MEAL_PLAN' | 'WORKOUT_PLAN' | 'PROGRESS';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentPlan, setCurrentPlan] = useState<GeneratedPlan | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [draftEmail, setDraftEmail] = useState<string>('');
  const [draftPassword, setDraftPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load persistence logic and theme
  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem('fitcoach_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // User data loading
    const savedUsers = localStorage.getItem('fitcoach_users');
    const activeUserEmail = localStorage.getItem('fitcoach_active_user');
    
    let loadedUsers: UserProfile[] = [];
    if (savedUsers) {
      loadedUsers = JSON.parse(savedUsers);
      setUsers(loadedUsers);
    }

    if (activeUserEmail) {
      const activeUser = loadedUsers.find(u => u.email === activeUserEmail);
      if (activeUser) {
        setCurrentUser(activeUser);
        setView('DASHBOARD');
        
        // Load plan for this user
        const savedPlan = localStorage.getItem(`fitcoach_plan_${activeUser.id}`);
        if (savedPlan) {
          setCurrentPlan(JSON.parse(savedPlan));
        }
      }
    }
  }, []);

  // Theme toggle handler
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fitcoach_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fitcoach_theme', 'light');
    }
  };

  const saveUserToDb = (user: UserProfile) => {
    // Remove old version of user if exists and add new one
    const updatedUsers = [user, ...users.filter(u => u.email !== user.email)];
    setUsers(updatedUsers);
    localStorage.setItem('fitcoach_users', JSON.stringify(updatedUsers));
    localStorage.setItem('fitcoach_active_user', user.email);
  };

  const handleLogin = (email: string, password: string) => {
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      // Strict password check
      if (existingUser.password === password) {
        setAuthError('');
        setCurrentUser(existingUser);
        
        // Load their plan
        const savedPlan = localStorage.getItem(`fitcoach_plan_${existingUser.id}`);
        if (savedPlan) {
          setCurrentPlan(JSON.parse(savedPlan));
        } else {
          setCurrentPlan(null);
        }
        localStorage.setItem('fitcoach_active_user', existingUser.email);
        setView('DASHBOARD');
      } else {
        setAuthError('Incorrect password. Please try again.');
      }
    } else {
      setAuthError('Account not found. Please register to create a new account.');
    }
  };

  const handleRegisterStart = (email: string, password: string) => {
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      setAuthError('Account with this email already exists. Please login.');
    } else {
      setAuthError('');
      setDraftEmail(email);
      setDraftPassword(password);
      setView('PROFILE');
    }
  };

  const handleProfileSubmit = async (formData: Omit<UserProfile, 'id' | 'createdAt' | 'weightLogs'>) => {
    setIsLoading(true);
    
    // Check if we are updating existing user or creating new
    const newUser: UserProfile = currentUser ? {
      ...currentUser,
      ...formData
    } : {
      ...formData,
      password: draftPassword, // Save the password for new users
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      // Initialize weight history for new user
      weightLogs: [{ date: new Date().toISOString().split('T')[0], weight: formData.weight }] 
    };

    setCurrentUser(newUser);
    saveUserToDb(newUser);
    
    // Clear draft data
    setDraftEmail('');
    setDraftPassword('');
    
    // After profile save, go to dashboard
    setView('DASHBOARD');
    setIsLoading(false);
  };

  const handleGeneratePlan = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const plan = await generateFitnessPlan(currentUser);
      setCurrentPlan(plan);
      localStorage.setItem(`fitcoach_plan_${currentUser.id}`, JSON.stringify(plan));
    } catch (error) {
      alert("Failed to generate plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogWeight = (weight: number) => {
    if (!currentUser) return;
    
    const today = new Date().toISOString().split('T')[0];
    const newLog = { date: today, weight };
    
    // Get existing logs or empty array
    const existingLogs = currentUser.weightLogs || [];
    
    // Remove any existing entry for today to overwrite it
    const otherLogs = existingLogs.filter(l => l.date !== today);
    
    // Add new log and sort by date
    const updatedLogs = [...otherLogs, newLog].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const updatedUser = {
      ...currentUser,
      weight: weight, // Update current weight as well
      weightLogs: updatedLogs
    };

    setCurrentUser(updatedUser);
    saveUserToDb(updatedUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPlan(null);
    localStorage.removeItem('fitcoach_active_user');
    setView('LOGIN');
    setAuthError('');
  };

  if (view === 'LOGIN') {
    return <Login onLogin={handleLogin} onRegister={handleRegisterStart} error={authError} />;
  }

  // Fallback if somehow we aren't in login but have no user (e.g. forced state change) and not in profile creation
  if (!currentUser && view !== 'PROFILE') {
     return <Login onLogin={handleLogin} onRegister={handleRegisterStart} error={authError} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar */}
      {currentUser && (
        <Sidebar 
          activeView={view} 
          onNavigate={setView} 
          onLogout={handleLogout}
          user={currentUser}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto h-full p-8 ${currentUser ? 'ml-64' : ''}`}>
        <div className="max-w-5xl mx-auto">
          {view === 'DASHBOARD' && currentUser && (
            <DashboardHome user={currentUser} plan={currentPlan} onNavigate={setView} />
          )}

          {view === 'PROFILE' && (
            <InputForm 
              initialData={currentUser} 
              draftEmail={draftEmail}
              onSubmit={handleProfileSubmit} 
              isLoading={isLoading} 
            />
          )}

          {view === 'MEAL_PLAN' && (
            <MealPlanView 
              plan={currentPlan} 
              onGenerate={handleGeneratePlan} 
              isLoading={isLoading} 
            />
          )}

          {view === 'WORKOUT_PLAN' && (
            <WorkoutPlanView 
              plan={currentPlan} 
              onGenerate={handleGeneratePlan} 
              isLoading={isLoading} 
            />
          )}

          {view === 'PROGRESS' && currentUser && (
            <ProgressView 
              logs={currentUser.weightLogs || []} 
              currentWeight={currentUser.weight}
              onLogWeight={handleLogWeight}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;