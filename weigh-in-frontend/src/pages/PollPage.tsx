import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPoll, submitPollResponse, getPollResults, Poll } from '../api';
import { AuthContext } from '../AuthContext';

const PollPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{[key: string]: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPoll = async () => {
      try {
        if (id) {
          const pollData = await getPoll(parseInt(id));
          setPoll(pollData);
          const resultsData = await getPollResults(parseInt(id));
          setResults(resultsData.results);
        }
      } catch (err) {
        setError('Failed to load poll. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoll();
  }, [id, user, navigate]);

  const handleSubmit = async () => {
    if (!user || !poll || selectedResponse === null) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await submitPollResponse({
        userid: user.userid!,
        questionid: poll.id!,
        response: selectedResponse + 1
      });

      // Fetch updated results
      const resultsData = await getPollResults(poll.id!);
      setResults(resultsData.results);
    } catch (err) {
      setError('Failed to submit response. You may have already voted on this poll.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-800 dark:text-gray-200">Loading poll...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-800 dark:text-gray-200">Poll not found</div>
      </div>
    );
  }

  const responses = [poll.response1, poll.response2, poll.response3, poll.response4];
  const totalVotes = results 
    ? Object.values(results).reduce((sum, count) => sum + count, 0)
    : 0;

  return (
    <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-blue-500 dark:text-blue-400 hover:underline"
        >
          ← Back to Home
        </button>

        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          {poll.question}
        </h1>

        {poll.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {poll.description}
          </p>
        )}

        <div className="space-y-4">
          {responses.map((response, index) => (
            <div
              key={index}
              onClick={() => !results && setSelectedResponse(index)}
              className={`p-4 rounded-lg border cursor-pointer transition-all
                ${
                  selectedResponse === index
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-gray-100">{response}</span>
                {results && (
                  <span className="text-gray-600 dark:text-gray-400">
                    {((results[response] || 0) / totalVotes * 100).toFixed(1)}%
                    ({results[response] || 0} votes)
                  </span>
                )}
              </div>
              {results && (
                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 dark:bg-blue-600"
                    style={{
                      width: `${((results[response] || 0) / totalVotes * 100)}%`
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {!results && (
          <button
            onClick={handleSubmit}
            disabled={selectedResponse === null || isSubmitting}
            className={`mt-6 w-full py-3 rounded-lg text-white transition-colors
              ${
                selectedResponse === null || isSubmitting
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
              }
            `}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Vote'}
          </button>
        )}

        {results && (
          <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Total votes: {totalVotes}
          </div>
        )}
      </div>
    </div>
  );
};

export default PollPage;