import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-md">
        <div className="flex flex-col items-center mb-6">
          <div className="text-4xl mb-2">👤</div> {/* Replace with an icon library if preferred */}
          <h1 className="text-2xl font-bold">Login</h1>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">EMAIL</label>
            <input
              type="email"
              placeholder="hello@reallygreatsite.com"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">PASSWORD</label>
            <input
              type="password"
              placeholder="******"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;