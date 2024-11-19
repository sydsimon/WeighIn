import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPolls, Poll } from "../api";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const data = await getPolls();
        setPolls(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load polls. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, []);

    const handlePollClick = (poll: Poll) => {
        navigate(`/poll/${poll.id}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl">Loading polls...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="flex items-center justify-between p-4 bg-green-200">
                <div className="text-3xl font-bold text-blue-400">Weigh IN</div>
                <input
                    type="text"
                    placeholder="Search"
                    className="w-1/3 px-2 py-1 border rounded-md focus:outline-none"
                />
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate("/login")} className="px-4 py-2 bg-blue-500 text-white rounded-md">Log In</button>
                    <button onClick={() => navigate("/create-account")} className="px-4 py-2 bg-green-600 text-white rounded-md">Join Now</button>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Answer the following polls from other users</h2>

                {polls.length === 0 ? (
                    <div className="text-center text-gray-500">No polls available</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {polls.map((poll, index) => (
                            <div 
                                key={poll.id} 
                                className="border p-4 rounded-md shadow-md bg-white cursor-pointer hover:bg-gray-50 transition"
                                onClick={() => handlePollClick(poll)}
                            >
                                <div className="flex items-center space-x-2">
                                    <div 
                                        className={`w-8 h-8 rounded-full ${
                                            index % 4 === 0 ? 'bg-blue-500' : 
                                            index % 4 === 1 ? 'bg-green-500' : 
                                            index % 4 === 2 ? 'bg-red-500' : 
                                            'bg-yellow-500'
                                        }`}
                                    ></div>
                                    <span>Poll #{poll.id}</span>
                                </div>
                                <div className="mt-2 text-lg font-semibold">{poll.question}</div>
                                <div className="mt-2 text-sm text-gray-600">{poll.description}</div>
                                <div className="mt-2 text-xs text-gray-500">
                                    Created: {new Date(poll.startTime).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => navigate("/create-poll")} 
                        className="px-8 py-3 bg-green-600 text-white rounded-full text-lg"
                    >
                        Create Question
                    </button>
                </div>
            </div>

            <footer className="flex justify-center items-center space-x-3 py-4 bg-green-200">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            </footer>
        </div>
    );
};

export default Home;