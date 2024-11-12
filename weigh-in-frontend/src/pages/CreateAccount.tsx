import React from 'react';


const CreateAccount: React.FC = () => {

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold text-center mb-2">Create New Account</h1>
        <p className="text-center text-gray-500 mb-6">
          Already Registered? <a href="login" className="text-blue-500">Login</a>
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">NAME</label>
            <input
              type="text"
              placeholder="Jiara Martins"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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

          <div>
            <label className="block text-sm font-semibold text-gray-700">DATE OF BIRTH</label>
            <select className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select</option>
              {/* Add options for date selection here */}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;