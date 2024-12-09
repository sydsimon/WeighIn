import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { useAuth } from '../AuthContext';
import Header from './Header';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await loginUser(formData);
      login(response);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-gray-50 dark:bg-gray-900">
      <Header showProfileButton={false} showHomeButton={true} />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm p-8 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700/30 rounded-md">
          <div className="flex flex-col items-center mb-6">
            <div className="text-4xl mb-2">👤</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Login</h1>
          </div>

          {error && (
            <div className="mb-4 p-2 text-red-500 dark:text-red-400 
                           bg-red-100 dark:bg-red-900/30 
                           border border-red-200 dark:border-red-800 
                           rounded text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                USERNAME
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 rounded-md
                         bg-white dark:bg-gray-700
                         text-gray-900 dark:text-gray-100
                         border border-gray-300 dark:border-gray-600
                         focus:outline-none focus:ring-2 
                         focus:ring-blue-500 dark:focus:ring-blue-400
                         placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                PASSWORD
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 rounded-md
                         bg-white dark:bg-gray-700
                         text-gray-900 dark:text-gray-100
                         border border-gray-300 dark:border-gray-600
                         focus:outline-none focus:ring-2 
                         focus:ring-blue-500 dark:focus:ring-blue-400
                         placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 mt-4 text-white rounded-md
                       bg-blue-500 dark:bg-blue-600 
                       hover:bg-blue-600 dark:hover:bg-blue-700
                       disabled:bg-blue-300 dark:disabled:bg-blue-800 
                       disabled:cursor-not-allowed
                       transition-colors
                       focus:outline-none focus:ring-2 
                       focus:ring-blue-500 dark:focus:ring-blue-400
                       focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {isLoading ? 'Logging in...' : 'LOGIN'}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/create-account')}
                className="text-blue-500 dark:text-blue-400 
                        hover:text-blue-600 dark:hover:text-blue-300 
                        transition-colors"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;