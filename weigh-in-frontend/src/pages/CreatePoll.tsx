import React, { useState, ChangeEvent, FormEvent } from 'react';
import { AlertCircle, Clock, Home, Menu, User } from 'lucide-react';
import { createPoll, Poll } from '../api';
import { useAuth } from '../AuthContext';

const CreatePoll: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    header: '',
    description: '',
    choices: ['', '', '', ''],
    deadline: ''
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...formData.choices];
    newChoices[index] = value;
    setFormData({
      ...formData,
      choices: newChoices
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('Please log in to create a poll');
      return;
    }  
    // Validation
    if (!formData.header.trim()) {
      setError('Please enter a poll header');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please enter a poll description');
      return;
    }
    if (formData.choices.some(choice => !choice.trim())) {
      setError('Please fill in all choices');
      return;
    }
    if (!formData.deadline) {
      setError('Please set a deadline');
      return;
    }
  
    // Prepare poll data for API
    const pollData: Poll = {
      authorId: user.userid, // Ensure this is not 0
      question: formData.header,
      description: formData.description,
      startTime: new Date(formData.deadline).toISOString(), // Ensure ISO string format
      response1: formData.choices[0],
      response2: formData.choices[1],
      response3: formData.choices[2],
      response4: formData.choices[3]
    };
  
    try {
      setIsSubmitting(true);
      await createPoll(pollData);
      
      setSuccess('Poll created successfully!');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          header: '',
          description: '',
          choices: ['', '', '', ''],
          deadline: ''
        });
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create poll');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900">
      <header className="flex items-center justify-between p-4 bg-green-200 dark:bg-green-900 shadow-sm">
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        <input
          type="text"
          placeholder="Search"
          className="w-1/3 px-4 py-2 border rounded-lg 
                   bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-100
                   border-gray-300 dark:border-gray-600 
                   focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-600"
        />
        <div className="flex items-center space-x-4">
          <User className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          <Home className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </div>
      </header>

      <div className="flex flex-col items-center p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Create Poll</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 
                          text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 
                          text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
              <p>{success}</p>
            </div>
          )}

          <div>
            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Poll Header
            </label>
            <input
              type="text"
              name="header"
              value={formData.header}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg
                       bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100
                       border border-gray-300 dark:border-gray-600
                       focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-600"
              placeholder="Enter your question here"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg h-24 resize-none
                       bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100
                       border border-gray-300 dark:border-gray-600
                       focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-600"
              placeholder="Provide more context for your poll"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Choices
            </label>
            <div className="space-y-3">
              {formData.choices.map((choice, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                    className="w-full px-4 py-2 rounded-lg
                             bg-white dark:bg-gray-800 
                             text-gray-900 dark:text-gray-100
                             border border-gray-300 dark:border-gray-600
                             focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-600"
                    placeholder={`Choice ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Deadline
            </label>
            <div className="flex items-center space-x-2">
              <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-lg
                         bg-white dark:bg-gray-800 
                         text-gray-900 dark:text-gray-100
                         border border-gray-300 dark:border-gray-600
                         focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-3 rounded-lg 
                     hover:bg-green-600 dark:hover:bg-green-700 
                     focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-600 
                     focus:ring-offset-2 dark:focus:ring-offset-gray-900
                     transition-colors
                     ${isSubmitting 
                       ? 'bg-green-300 dark:bg-green-500 cursor-not-allowed' 
                       : 'bg-green-500 dark:bg-green-600'}`}
          >
            {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;