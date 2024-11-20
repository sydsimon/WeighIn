import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../api';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAccount(formData);
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700/30 rounded-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
          Create New Account
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Already Registered?{' '}
          <a 
            href="/login" 
            className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 
                     transition-colors"
          >
            Login
          </a>
        </p>

        {error && (
          <div className="mb-4 p-2 text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 
                         border border-red-200 dark:border-red-800 rounded">
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
            className="w-full py-2 text-white 
                     bg-blue-500 dark:bg-blue-600 
                     hover:bg-blue-600 dark:hover:bg-blue-700
                     rounded-md transition-colors
                     focus:outline-none focus:ring-2 
                     focus:ring-blue-500 dark:focus:ring-blue-400
                     focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;