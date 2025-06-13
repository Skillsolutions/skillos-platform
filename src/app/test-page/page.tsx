import React from 'react';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-blue-500 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Minimal Test Page</h1>
        <p className="text-lg">This page is a test to see if Tailwind CSS styling is applied correctly during static export.</p>
        <button className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Styled Button
        </button>
      </div>
    </div>
  );
}
