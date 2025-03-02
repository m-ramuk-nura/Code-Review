"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/question") // defaults to q_id = 1
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((result) => setData(result))
      .catch((err) => setError(err.message));
  }, []);

  if (error)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full border-l-4 border-red-500">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-700 font-medium">
            Loading question data...
          </p>
        </div>
      </div>
    );

  // Use the first submission if available
  const userSubmission = data.submissions[0];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white">
      {/* Main Content */}
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white shadow-md">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{data.title}</h1>
              <div className="flex space-x-2"></div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Problem Description - 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                  <div className="border-b border-gray-200 bg-blue-50 px-6 py-4">
                    <h2 className="text-xl font-semibold text-blue-800">
                      Problem Description
                    </h2>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 whitespace-pre-line">
                      {data.description}
                    </p>
                  </div>
                </div>

                {/* Test Cases */}
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                  <div className="border-b border-gray-200 bg-blue-50 px-6 py-4">
                    <h2 className="text-xl font-semibold text-blue-800 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Test Cases
                    </h2>
                  </div>
                  <div className="p-6">
                    {data.testCases && data.testCases.length > 0 ? (
                      <div className="overflow-x-auto -mx-6">
                        <table className="min-w-full divide-y divide-blue-100">
                          <thead>
                            <tr className="bg-blue-50">
                              <th className="py-3 px-6 text-left text-sm font-medium text-blue-800 border-b">
                                Input
                              </th>
                              <th className="py-3 px-6 text-left text-sm font-medium text-blue-800 border-b">
                                Expected Output
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.testCases.map((tc, index) => (
                              <tr
                                key={tc.id}
                                className={
                                  index % 2 === 0 ? "bg-white" : "bg-blue-50"
                                }
                              >
                                <td className="py-3 px-6 text-gray-700 font-mono whitespace-pre">
                                  {tc.input}
                                </td>
                                <td className="py-3 px-6 text-gray-700 font-mono whitespace-pre">
                                  {tc.expected_output}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-blue-700 text-center">
                        No test cases available.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* User Code - 3 columns */}
              <div className="lg:col-span-3">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden h-full flex flex-col">
                  <div className="border-b border-gray-200 bg-blue-50 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-blue-800 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                      User Code
                    </h2>
                  </div>
                  <div className="flex-grow flex flex-col">
                    {userSubmission ? (
                      <div className="flex flex-col h-full">
                        <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="ml-2 text-gray-400 text-sm">
                            solution.js
                          </span>
                        </div>
                        <pre className="flex-grow bg-gray-900 p-6 rounded-b-lg text-sm font-mono text-blue-100 overflow-auto whitespace-pre">
                          {userSubmission.code}
                        </pre>
                      </div>
                    ) : (
                      <div className="flex-grow flex items-center justify-center bg-blue-50 p-6">
                        <div className="text-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto text-blue-300 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <p className="text-blue-700 mb-4">
                            No submission available.
                          </p>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Start Coding
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
