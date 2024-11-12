// src/pages/Home.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
      // Add any pre-navigation logic here if needed
      navigate("/login");
    };
  
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <header className="flex items-center justify-between p-4 bg-green-200">
          <div className="text-3xl font-bold text-blue-400">Weigh IN</div>
          <input
            type="text"
            placeholder="Search"
            className="w-1/3 px-2 py-1 border rounded-md focus:outline-none"
          />
          <div className="flex items-center space-x-4">
            <button onClick={handleLoginClick} className="px-4 py-2 bg-blue-500 text-white rounded-md">Log In</button>
            <button onClick={() => navigate("/create-account")} className="px-4 py-2 bg-green-600 text-white rounded-md">Join Now</button>
          </div>
        </header>

      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Answer the following polls from other users</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Poll 1 */}
          <div className="border p-4 rounded-md shadow-md bg-white">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              <span>Poll #1</span>
            </div>
            <div className="mt-2 bg-blue-500 w-full h-10 rounded-md"></div>
            <div className="mt-2 bg-green-300 w-full h-6 rounded-md"></div>
            <div className="mt-2 bg-green-300 w-3/4 h-6 rounded-md"></div>
          </div>

          {/* Poll 2 */}
          <div className="border p-4 rounded-md shadow-md bg-white">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              <span>Poll #2</span>
            </div>
            <div className="mt-2 bg-blue-500 w-full h-10 rounded-md"></div>
            <div className="mt-2 bg-green-300 w-full h-6 rounded-md"></div>
            <div className="mt-2 bg-green-300 w-3/4 h-6 rounded-md"></div>
          </div>

          {/* Poll 3 */}
          <div className="border p-4 rounded-md shadow-md bg-white">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-full"></div>
              <span>Poll #3</span>
            </div>
            <div className="mt-2 bg-blue-500 w-full h-10 rounded-md"></div>
            <div className="mt-2 bg-green-300 w-full h-6 rounded-md"></div>
            <div className="mt-2 bg-green-300 w-3/4 h-6 rounded-md"></div>
          </div>

          {/* Poll 4 */}
          <div className="border p-4 rounded-md shadow-md bg-white">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
              <span>Poll #4</span>
            </div>
            <div className="mt-2 bg-blue-500 w-full h-10 rounded-md"></div>
            <div className="mt-2 bg-green-300 w-full h-6 rounded-md"></div>
            <div className="mt-2 bg-green-300 w-3/4 h-6 rounded-md"></div>
          </div>
        </div>

        {/* Create Question Button */}
        <div className="mt-6 text-center">
          <button onClick={() => navigate("/create-poll")} className="px-8 py-3 bg-green-600 text-white rounded-full text-lg">Create Question</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-center items-center space-x-3 py-4 bg-green-200">
        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
      </footer>
    </div>
  );
};

export default Home;
