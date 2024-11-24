import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomQualityControlPoll, checkQualityControlResponse, QualityControlPoll } from '../api';

interface QualityControlProps {
  onPass: () => void;
}

const QualityControl: React.FC<QualityControlProps> = ({ onPass }) => {
  const [poll, setPoll] = useState<QualityControlPoll | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const pollData = await getRandomQualityControlPoll();
        setPoll(pollData);
      } catch (err) {
        setError('Failed to load quality control question');
        console.error(err);
      }
    };
    fetchPoll();
  }, []);

  const handleSubmit = async () => {
    if (!selectedResponse || !poll || !user.userid) return;

    setIsSubmitting(true);
    try {
      const response = await checkQualityControlResponse({
        userid: user.userid,
        questionid: poll.questionid,
        response: selectedResponse
      });

      if (response.is_correct) {
        localStorage.setItem('qualityControlPassed', 'true');
        onPass();
      } else {
        setError('Incorrect answer. Please try again with a new question.');
        // Reset and fetch a new question
        setSelectedResponse(null);
        const newPoll = await getRandomQualityControlPoll();
        setPoll(newPoll);
      }
    } catch (err) {
      setError('Failed to submit response');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="w-screen h-screen mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-red-500 dark:text-red-400 text-center mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="w-screen h-screen mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-gray-600 dark:text-gray-300 text-center">Loading quality control question...</div>
      </div>
    );
  }

  const responses = [poll.response1, poll.response2, poll.response3, poll.response4];

  return (
    <div className="w-screen h-screen mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Quality Control Check</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Please answer this question correctly to access the website.
      </p>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{poll.question}</h3>
        {poll.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-4">{poll.description}</p>
        )}
      </div>

      <div className="space-y-3">
        {responses.map((response, index) => (
          <div
            key={index}
            onClick={() => setSelectedResponse(index + 1)}
            className={`p-4 rounded-lg border cursor-pointer transition-all
              ${selectedResponse === index + 1
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
          >
            <span className="text-gray-900 dark:text-gray-100">{response}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedResponse || isSubmitting}
        className={`mt-6 w-full py-3 rounded-lg text-white transition-colors
          ${!selectedResponse || isSubmitting
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
          }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Answer'}
      </button>
    </div>
  );
};

export default QualityControl;