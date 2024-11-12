import React from 'react';

const CreatePoll: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="flex items-center justify-between p-4 bg-green-200">
        <div className="text-xl font-bold">≡</div>
        <input
          type="text"
          placeholder="Search"
          className="w-1/3 px-2 py-1 border rounded-md focus:outline-none"
        />
        <div className="flex items-center space-x-4">
          <span className="text-2xl">👤</span> {/* User Icon */}
          <span className="text-2xl">🏠</span> {/* Home Icon */}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold mb-8">Create Question</h1>

        <form className="w-full max-w-md space-y-4">
          <div>
            <label className="block text-lg font-semibold">Header</label>
            <input
              type="text"
              className="w-full h-10 mt-1 bg-blue-500 rounded-md"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold">Description:</label>
            <textarea
              className="w-full h-10 mt-1 bg-blue-500 rounded-md"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold">Responses:</label>
            <div className="space-y-2 mt-1">
              <input type="text" className="w-full h-10 bg-green-300 rounded-md" />
              <input type="text" className="w-full h-10 bg-green-300 rounded-md" />
              <input type="text" className="w-full h-10 bg-green-300 rounded-md" />
              <input type="text" className="w-full h-10 bg-green-300 rounded-md" />
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold">Deadline:</label>
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🕒</span> {/* Clock Icon */}
              <input type="date" className="px-2 py-1 border rounded-md focus:outline-none" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;
