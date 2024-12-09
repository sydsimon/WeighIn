import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, Users, TrendingUp, CheckCircle, ChevronRight, Lock } from 'lucide-react';
import { getPolls, Poll } from '../api';
import { useAuth } from '../AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPolls = async () => {
      setIsLoading(true);
      try {
        const data = await getPolls();
        // Only show the 3 most recent polls
        setPolls(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load polls:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, []);
  
  const features = [
    {
      icon: <Vote className="w-12 h-12 text-green-500" />,
      title: "Create Polls",
      description: "Easily create and share polls with your community."
    },
    {
      icon: <Users className="w-12 h-12 text-blue-500" />,
      title: "Engage Users",
      description: "Get instant feedback and insights from your audience."
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-purple-500" />,
      title: "Track Results",
      description: "View real-time results and detailed analytics."
    }
  ];

  const benefits = [
    "Quick and easy poll creation",
    "Real-time voting and results",
    "User-friendly interface",
    "Secure and reliable platform"
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/create-account');
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">WeighIn</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSignIn}
                    className="px-4 py-2 font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block">Welcome to</span>
                  <span className="block text-green-600 dark:text-green-400">WeighIn</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  Create, share, and analyze polls with ease. Get instant feedback from your community and make data-driven decisions.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                  <div className="rounded-md shadow">
                    <button 
                      onClick={handleGetStarted}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Powerful Features
            </h2>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
              Everything you need to gather and analyze opinions
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 dark:bg-gray-700 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-lg">
                        {feature.icon}
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Why Choose WeighIn?
            </h2>
          </div>
          <div className="mt-10">
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Poll Preview Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Featured Polls
            </h2>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
              Preview what's being discussed right now
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-600 dark:text-gray-400">
              Loading polls...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {polls.map((poll, index) => (
                <div key={poll.id} className="relative group">
                  <div className="h-full border border-gray-200 dark:border-gray-700 p-6 rounded-lg 
                               bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className={`w-8 h-8 rounded-full ${
                        index % 3 === 0 ? 'bg-blue-500 dark:bg-blue-600' :
                        index % 3 === 1 ? 'bg-green-500 dark:bg-green-600' :
                        'bg-purple-500 dark:bg-purple-600'
                      }`} />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Poll #{poll.id}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {poll.question}
                    </h3>
                    
                    {poll.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {poll.description}
                      </p>
                    )}

                    <div className="space-y-2">
                      {[poll.response1, poll.response2, poll.response3, poll.response4].map((response, idx) => (
                        <div key={idx} 
                             className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md
                                      text-gray-600 dark:text-gray-300 text-sm">
                          {response}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overlay for non-logged-in users */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 
                                flex items-center justify-center rounded-lg opacity-0 
                                group-hover:opacity-100 transition-opacity">
                    <div className="text-center p-4">
                      <Lock className="w-8 h-8 text-white mx-auto mb-2" />
                      <button
                        onClick={handleSignIn}
                        className="text-white bg-green-600 hover:bg-green-700 
                                 px-4 py-2 rounded-md transition-colors"
                      >
                        Sign in to participate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 dark:bg-green-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-green-200">Join WeighIn today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button 
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
              >
                Sign Up Now
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;