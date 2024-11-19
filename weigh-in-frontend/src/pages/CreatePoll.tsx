import React, { useState, ChangeEvent, FormEvent } from 'react';
import { AlertCircle, Clock, Home, Menu, User } from 'lucide-react';

interface FormData {
  header: string;
  description: string;
  choices: [string, string, string, string];
  deadline: string;
}

const CreatePoll: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    header: '',
    description: '',
    choices: ['', '', '', ''],
    deadline: ''
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...formData.choices] as [string, string, string, string];
    newChoices[index] = value;
    setFormData({
      ...formData,
      choices: newChoices
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
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

    console.log('Submitting poll data:', formData);
    setSuccess('Poll created successfully!');
    
    setTimeout(() => {
      setFormData({
        header: '',
        description: '',
        choices: ['', '', '', ''],
        deadline: ''
      });
      setSuccess('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4 bg-green-200 shadow-sm">
        <Menu className="w-6 h-6" />
        <input
          type="text"
          placeholder="Search"
          className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <div className="flex items-center space-x-4">
          <User className="w-6 h-6" />
          <Home className="w-6 h-6" />
        </div>
      </header>

      <div className="flex flex-col items-center p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Create Poll</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              <p>{success}</p>
            </div>
          )}

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Poll Header
            </label>
            <input
              type="text"
              name="header"
              value={formData.header}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Enter your question here"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 h-24 resize-none"
              placeholder="Provide more context for your poll"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Choices
            </label>
            <div className="space-y-3">
              {formData.choices.map((choice, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder={`Choice ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Deadline
            </label>
            <div className="flex items-center space-x-2">
              <Clock className="w-6 h-6 text-gray-600" />
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
          >
            Create Poll
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;