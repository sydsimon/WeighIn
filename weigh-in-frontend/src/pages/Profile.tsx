import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getPolls, getResponses, Poll, PollResponse} from "../api";
import { AuthContext } from "../AuthContext";
import Header from './Header';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [polls, setPolls] = useState<Poll[]>([]);
    const [createdPolls, setCreatedPolls] = useState<Poll[]>([]);
    const [respondedPolls, setRespondedPolls] = useState<Poll[]>([]);
    const [userResponses, setUserResponses] = useState<PollResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const data = await getPolls();
                setPolls(data);
            } catch (err) {
                setError('Failed to load polls. Please try again later.');
            }
        };

        fetchPolls();
    }, []);

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const data = await getResponses();
                if (user) {
                    const userData = data.filter(response => response.userid === user.userid);
                    setUserResponses(userData);
                }
                setIsLoading(false);
            } catch (err) {
                setError('Failed to load user responses. Please try again later.');
                setIsLoading(false);
            }
        };
        fetchResponses();
    }, [user]);

    useEffect(() => {
        if (user) {
            setCreatedPolls(polls.filter(poll => poll.authorId === user.userid));
        }
    }, [polls, user]);

    useEffect(() => {
        if (user && userResponses.length > 0) {
            const respondedPollIds = userResponses.map(response => response.questionid);
            setRespondedPolls(
                polls.filter(poll => poll.id !== undefined && respondedPollIds.includes(poll.id))
            );
        }
    }, [polls, userResponses]);


    const handlePollClick = (poll: Poll) => {
        if (user) {
            navigate(`/poll/${poll.id}`);
        } else {
            navigate("/login");
        }
    };

    // const handleHome = () => {
    //     if (user) {
    //         navigate("/");
    //     } else {
    //         navigate("/login");
    //     }
    // };

    if (isLoading) {
        return (
            <div className="min-h-screen w-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-xl text-gray-800 dark:text-gray-200">Loading polls...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-xl text-red-500 dark:text-red-400">{error}</div>
            </div>
        );
    }

    return (
        <div className="w-screen min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header showProfileButton={false} />

            {/* Main Content */}
            <div className="p-6 flex">
                {/* Left column - Created Polls */}
                <div className="w-1/2 pr-3">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        {user ? "Your Polls:" : "Sign in to view your profile"}
                    </h2>
                    {createdPolls.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            {user ? "You haven't created any polls yet." : "Please log in to see your polls."}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {createdPolls.map((poll, index) => (
                                <div
                                    key={poll.id}
                                    className="border border-gray-200 dark:border-gray-700 p-4 rounded-md shadow-md
                                            bg-white dark:bg-gray-800 cursor-pointer
                                            hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    onClick={() => handlePollClick(poll)}
                                >
                                    {/* Poll content */}
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
                                        Deadline: {new Date(poll.startTime).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right column - Responded Polls */}
                <div className="w-1/2 pl-3">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        {user ? "Polls You've Responded To:" : ""}
                    </h2>
                    {respondedPolls.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            {user ? "You haven't responded to any polls yet." : "Please log in to see polls you've responded to."}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {respondedPolls.map((poll, index) => (
                                <div
                                    key={poll.id}
                                    className="border border-gray-200 dark:border-gray-700 p-4 rounded-md shadow-md
                                            bg-white dark:bg-gray-800 cursor-pointer
                                            hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    onClick={() => handlePollClick(poll)}
                                >
                                    {/* Poll content */}
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
                                        Deadline: {new Date(poll.startTime).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;