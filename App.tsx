import React, { useState, useEffect, Component } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import MealPlanView from './components/MealPlanView';
import WorkoutPlanView from './components/WorkoutPlanView';
import ProgressView from './components/ProgressView';
import InputForm from './components/InputForm';
import Login from './components/Login';
import { UserProfile, GeneratedPlan } from './types';
import { generateFitnessPlan } from './services/geminiService';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, getDocFromServer } from 'firebase/firestore';

type ViewState = 'LOGIN' | 'DASHBOARD' | 'PROFILE' | 'MEAL_PLAN' | 'WORKOUT_PLAN' | 'PROGRESS';

// Error Boundary Component
class ErrorBoundary extends Component<any, any> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      let message = "Something went wrong.";
      try {
        const errInfo = JSON.parse(this.state.error.message);
        message = `Database Error: ${errInfo.error} during ${errInfo.operationType} at ${errInfo.path}`;
      } catch (e) {
        message = this.state.error?.message || message;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Application Error</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentPlan, setCurrentPlan] = useState<GeneratedPlan | null>(null);
  const [draftEmail, setDraftEmail] = useState<string>('');
  const [draftPassword, setDraftPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Validate connection to Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('fitcoach_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, fetch profile
        const userRef = doc(db, 'users', user.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setCurrentUser(userSnap.data() as UserProfile);
            setView('DASHBOARD');
          } else {
            // User exists in Auth but not in Firestore (maybe registration interrupted)
            setDraftEmail(user.email || '');
            setView('PROFILE');
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setCurrentUser(null);
        setCurrentPlan(null);
        setView('LOGIN');
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Real-time plan listener
  useEffect(() => {
    if (!currentUser || !isAuthReady) return;

    const planRef = doc(db, 'plans', currentUser.id);
    const unsubscribe = onSnapshot(planRef, (doc) => {
      if (doc.exists()) {
        setCurrentPlan(doc.data() as GeneratedPlan);
      } else {
        setCurrentPlan(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `plans/${currentUser.id}`);
    });

    return () => unsubscribe();
  }, [currentUser, isAuthReady]);

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

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the rest
    } catch (error: any) {
      console.error("Login error:", error);
      setAuthError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterStart = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError('');
    try {
      // We create the user in Auth first
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setDraftEmail(email);
      setDraftPassword(password);
      setView('PROFILE');
    } catch (error: any) {
      console.error("Registration error:", error);
      setAuthError(error.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (formData: Omit<UserProfile, 'id' | 'createdAt' | 'weightLogs'>) => {
    if (!auth.currentUser) return;
    setIsLoading(true);
    
    const uid = auth.currentUser.uid;
    const userRef = doc(db, 'users', uid);
    
    try {
      const newUser: UserProfile = currentUser ? {
        ...currentUser,
        ...formData
      } : {
        ...formData,
        id: uid,
        email: auth.currentUser.email || '',
        createdAt: new Date().toISOString(),
        weightLogs: [{ date: new Date().toISOString().split('T')[0], weight: formData.weight }] 
      };

      await setDoc(userRef, newUser);
      setCurrentUser(newUser);
      
      // Clear draft data
      setDraftEmail('');
      setDraftPassword('');
      
      setView('DASHBOARD');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const plan = await generateFitnessPlan(currentUser);
      const planRef = doc(db, 'plans', currentUser.id);
      
      const planData = {
        ...plan,
        userId: currentUser.id,
        updatedAt: new Date().toISOString()
      };

      await setDoc(planRef, planData);
      // onSnapshot will update currentPlan
    } catch (error) {
      console.error("Plan generation error:", error);
      alert("Failed to generate plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogWeight = async (weight: number) => {
    if (!currentUser) return;
    
    const today = new Date().toISOString().split('T')[0];
    const newLog = { date: today, weight };
    const existingLogs = currentUser.weightLogs || [];
    const otherLogs = existingLogs.filter(l => l.date !== today);
    const updatedLogs = [...otherLogs, newLog].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const userRef = doc(db, 'users', currentUser.id);
    try {
      await updateDoc(userRef, {
        weight: weight,
        weightLogs: updatedLogs
      });
      // Local state will be updated by the next render if we use onSnapshot for user too, 
      // but here we just update it manually for immediate feedback
      setCurrentUser({
        ...currentUser,
        weight,
        weightLogs: updatedLogs
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.id}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setCurrentPlan(null);
      setView('LOGIN');
      setAuthError('');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (view === 'LOGIN') {
    return <Login onLogin={handleLogin} onRegister={handleRegisterStart} error={authError} isLoading={isLoading} />;
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App;
