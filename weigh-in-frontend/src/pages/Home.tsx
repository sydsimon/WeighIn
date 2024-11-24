import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getPolls, Poll } from "../api";
import { AuthContext } from "../AuthContext";
import QualityControl from "./QualityControl";
import Header from './Header';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [polls, setPolls] = useState<Poll[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { user, logout, qualityControlPassed, setQualityControlPassed } = useContext(AuthContext);

    useEffect(() => {
        const fetchPolls = async () => {
            setIsLoading(true);
            try {
                const data = await getPolls();
                setPolls(data);
            } catch (err) {
                setError('Failed to load polls. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (user && qualityControlPassed) {
            fetchPolls();
        } else {
            setPolls([]);
            setError(null);
            setIsLoading(false);
        }
    }, [user, qualityControlPassed]);

    const handleQualityControlPass = () => {
        setQualityControlPassed(true);
    };

    const handlePollClick = (poll: Poll) => {
        if (user) {
            navigate(`/poll/${poll.id}`);
        } else {
            navigate("/login");
        }
    };

    const handleCreatePoll = () => {
        if (user) {
            navigate("/create-poll");
        } else {
            navigate("/login");
        }
    };

    if (user && !qualityControlPassed) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
                <QualityControl onPass={handleQualityControlPass} />
            </div>
        );
    }

    return (
        <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900">
            <Header showHomeButton={false} />

            {/* Rest of the component remains the same */}
            <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    {user 
                        ? "Answer the following polls from other users" 
                        : "Sign in to view and participate in polls"
                    }
                </h2>

                {isLoading ? (
                    <div className="text-center text-gray-800 dark:text-gray-200">
                        Loading polls...
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 dark:text-red-400">
                        {error}
                    </div>
                ) : !user ? (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        Please log in to see available polls
                    </div>
                ) : polls.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        No polls available
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {polls.map((poll, index) => (
                            <div 
                                key={poll.id} 
                                className="border border-gray-200 dark:border-gray-700 p-4 rounded-md shadow-md 
                                         bg-white dark:bg-gray-800 cursor-pointer 
                                         hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => handlePollClick(poll)}
                            >
                                <div className="flex items-center space-x-2">
                                    <div 
                                        className={`w-8 h-8 rounded-full ${
                                            index % 4 === 0 ? 'bg-blue-500 dark:bg-blue-600' : 
                                            index % 4 === 1 ? 'bg-green-500 dark:bg-green-600' : 
                                            index % 4 === 2 ? 'bg-red-500 dark:bg-red-600' : 
                                            'bg-yellow-500 dark:bg-yellow-600'
                                        }`}
                                    ></div>
                                    <span className="text-gray-900 dark:text-gray-100">Poll #{poll.id}</span>
                                </div>
                                <div className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {poll.question}
                                </div>
                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                    {poll.description}
                                </div>
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Created: {new Date(poll.startTime).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {user && (
                    <div className="mt-6 text-center">
                        <button 
                            onClick={handleCreatePoll}
                            className="px-8 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 
                                     text-white rounded-full text-lg transition-colors"
                        >
                            Create Question
                        </button>
                    </div>
                )}
            </div>

            <footer className="flex justify-center items-center space-x-3 py-4 bg-green-200 dark:bg-green-900">
                <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
            </footer>
        </div>
    );
};

export default Home;