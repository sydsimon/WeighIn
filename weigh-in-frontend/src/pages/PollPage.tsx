import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPoll, submitPollResponse, getPollResults, checkUserResponse, Poll } from '../api';
import { AuthContext } from '../AuthContext';
import Header from './Header';
import { ArrowLeft } from 'lucide-react';

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
  const [hasResponded, setHasResponded] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        if (id) {
          const pollData = await getPoll(parseInt(id));
          setPoll(pollData);

          const responseCheck = await checkUserResponse(user.userid!, parseInt(id));
          setHasResponded(responseCheck.hasResponded);

          if (responseCheck.hasResponded) {
            const resultsData = await getPollResults(parseInt(id));
            setResults(resultsData.results);
            setSelectedResponse(responseCheck?.response ? responseCheck.response - 1 : null);
          }
        }
      } catch (err) {
        setError('Failed to load poll data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

      const resultsData = await getPollResults(poll.id!);
      setResults(resultsData.results);
      setHasResponded(true);
    } catch (err) {
      setError('Failed to submit response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || error || !poll) {
    return (
      <div className="flex flex-col w-screen h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">
            {isLoading ? (
              <span className="text-gray-800 dark:text-gray-200">Loading poll...</span>
            ) : error ? (
              <span className="text-red-500 dark:text-red-400">{error}</span>
            ) : (
              <span className="text-gray-800 dark:text-gray-200">Poll not found</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  const responses = [poll.response1, poll.response2, poll.response3, poll.response4];
  const totalVotes = results 
    ? Object.values(results).reduce((sum, count) => sum + count, 0)
    : 0;

  return (
    <div className="flex flex-col w-screen h-screen bg-gray-50 dark:bg-gray-900">
      <Header showHomeButton={false} />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 mb-4 text-blue-500 dark:text-blue-400 
                     hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            {poll.question}
          </h1>

          {poll.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {poll.description}
            </p>
          )}

          {hasResponded ? (
            // Results View
            <div className="space-y-4">
              <div className="mb-4 text-lg font-semibold text-green-600 dark:text-green-400">
                Your response has been recorded!
              </div>
              {responses.map((response, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border
                    ${index === selectedResponse 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/30' 
                      : 'border-gray-200 dark:border-gray-700'
                    }
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-gray-100">{response}</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {((results?.[response] || 0) / totalVotes * 100).toFixed(1)}%
                      ({results?.[response] || 0} votes)
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        index === selectedResponse 
                          ? 'bg-green-500 dark:bg-green-600' 
                          : 'bg-blue-500 dark:bg-blue-600'
                      }`}
                      style={{
                        width: `${((results?.[response] || 0) / totalVotes * 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
                Total votes: {totalVotes}
              </div>
            </div>
          ) : (
            // Question View
            <div className="space-y-4">
              {responses.map((response, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedResponse(index)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all
                    ${
                      selectedResponse === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }
                  `}
                >
                  <span className="text-gray-900 dark:text-gray-100">{response}</span>
                </div>
              ))}

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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollPage;