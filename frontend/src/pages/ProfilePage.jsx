import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
    quizHistory: []
  });

  useEffect(() => {
    const username = localStorage.getItem('username'); // Use logged-in username
    
    const fetchUserQuizHistory = () => {
      fetch(`/quiz_results.csv?t=${new Date().getTime()}`)
        .then((response) => response.text())
        .then((data) => {
          Papa.parse(data, {
            header: true,
            complete: (result) => {
              const quizHistory = result.data
                .filter((quiz) => quiz.userName.trim() === username.trim())
                .map((quiz) => ({
                  date: new Date().toLocaleDateString(), // Placeholder for date, update with actual date if available
                  subject: quiz.difficulty, // Assuming `difficulty` is subject here, modify accordingly
                  score: quiz.score,
                  totalQuestions: 10 // Assuming total questions are 10, modify accordingly
                }));
              
              setUserData((prevData) => ({
                ...prevData,
                name: username,
                quizHistory
              }));
            },
            error: (err) => {
              console.error("Error reading the CSV file", err);
            }
          });
        })
        .catch((error) => {
          console.error('Error fetching the CSV file:', error);
        });
    };

    fetchUserQuizHistory();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-gray-800">User Profile</h2>
        <p className="text-gray-600 text-center mb-6">View your account details and quiz history below</p>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Account Information</h3>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="text-lg text-gray-700"><strong>Name:</strong> {userData.name}</p>
            {/* <p>Email: {userData.email}</p> */}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Quiz History</h3>
          {userData.quizHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <caption className="text-lg text-gray-700 mb-2 text-left">Your Recent Quiz Attempts</caption>
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Date</th>
                    <th className="py-3 px-6 text-left">Subject</th>
                    <th className="py-3 px-6 text-left">Score</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {userData.quizHistory.map((quiz, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <td className="py-3 px-6 text-left">{quiz.date}</td>
                      <td className="py-3 px-6 text-left">{quiz.subject}</td>
                      <td className="py-3 px-6 text-left">{quiz.score}/{quiz.totalQuestions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-lg text-gray-500 text-center">No quiz history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
