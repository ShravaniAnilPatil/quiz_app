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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <p className="text-gray-600">Your account details and quiz history</p>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Account Information</h3>
          <p>Name: {userData.name}</p>
          {/* <p>Email: {userData.email}</p> */}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Quiz History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white border-collapse border border-gray-200">
              <caption className="text-lg text-gray-700 mb-2">Your recent quiz attempts</caption>
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Date</th>
                  <th className="border px-4 py-2 text-left">Subject</th>
                  <th className="border px-4 py-2 text-left">Score</th>
                </tr>
              </thead>
              <tbody>
                {userData.quizHistory.map((quiz, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{quiz.date}</td>
                    <td className="border px-4 py-2">{quiz.subject}</td>
                    <td className="border px-4 py-2">
                      {quiz.score}/{quiz.totalQuestions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
