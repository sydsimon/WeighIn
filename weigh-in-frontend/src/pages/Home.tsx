import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getPolls, Poll } from "../api";
import { AuthContext } from "../AuthContext";
import QualityControl from "./QualityControl";
import Header from './Header';
import { Search } from 'lucide-react';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [polls, setPolls] = useState<Poll[]>([]);
    const [filteredPolls, setFilteredPolls] = useState<Poll[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { user, qualityControlPassed, setQualityControlPassed } = useContext(AuthContext);

    useEffect(() => {
        const fetchPolls = async () => {
            setIsLoading(true);
            try {
                const data = await getPolls();
                setPolls(data);
                setFilteredPolls(data);
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
            setFilteredPolls([]);
            setError(null);
            setIsLoading(false);
        }
    }, [user, qualityControlPassed]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredPolls(polls);
            return;
        }

        const searchTermLower = searchTerm.toLowerCase();
        const filtered = polls.filter(poll => 
            poll.question.toLowerCase().includes(searchTermLower) ||
            (poll.description?.toLowerCase().includes(searchTermLower))
        );
        setFilteredPolls(filtered);
    }, [searchTerm, polls]);

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
        <div className="min-h-screen w-screen bg-gray-50 dark:bg-gray-900">
            <Header showHomeButton={false} />

            <div className="p-6">
                {user && (
                    <div className="flex flex-col items-center space-y-6">
                        {/* Search Bar */}
                        <div className="w-full max-w-2xl">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                                 text-gray-400 dark:text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search polls..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border 
                                             border-gray-300 dark:border-gray-600
                                             bg-white dark:bg-gray-800 
                                             text-gray-900 dark:text-gray-100
                                             focus:outline-none focus:ring-2 
                                             focus:ring-green-500 dark:focus:ring-green-400
                                             transition-colors"
                                />
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleCreatePoll}
                            className="px-8 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 
                                     dark:hover:bg-green-800 text-white rounded-full text-lg 
                                     transition-colors"
                        >
                            Create Question
                        </button>

                    </div>
                )}

                <h2 className="text-xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100">
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
                ) : filteredPolls.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        {searchTerm ? "No polls match your search" : "No polls available"}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPolls.map((poll, index) => (
                            <div 
                                key={poll.id} 
                                className="border border-gray-200 dark:border-gray-700 p-4 
                                         rounded-md shadow-md bg-white dark:bg-gray-800 
                                         cursor-pointer hover:bg-gray-50 
                                         dark:hover:bg-gray-700 transition-colors"
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
                                    <span className="text-gray-900 dark:text-gray-100">
                                        Poll #{poll.id}
                                    </span>
                                </div>
                                <div className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {poll.question}
                                </div>
                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                    {poll.description}
                                </div>
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Deadline: {new Date(poll.startTime).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;