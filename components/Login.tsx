import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string) => void;
  error?: string;
  isLoading?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister, error, isLoading }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!email.trim() || !password.trim()) {
      setValidationError('Please fill in all fields.');
      return;
    }

    if (isRegistering) {
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters long.');
        return;
      }
      onRegister(email.trim(), password.trim());
    } else {
      onLogin(email.trim(), password.trim());
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setValidationError('');
    // Keep email/password but clear specific errors
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in transition-colors">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform rotate-3">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">FitCoach AI</h1>
            <p className="text-blue-100 mt-2 font-medium">Your Personal Fitness Intelligence</p>
          </div>
        </div>
        
        <div className="p-10">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 text-center">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-6 text-sm">
            {isRegistering ? 'Start your fitness journey today' : 'Enter your details to sign in'}
          </p>
          
          {(error || validationError) && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm font-medium text-center">
              {validationError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {isRegistering && (
              <div className="animate-fade-in">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <input 
                    type="password" 
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-600"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={toggleMode}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
              >
                {isRegistering ? 'Sign In' : 'Register Now'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;