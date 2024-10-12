import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    // const fetchAdminData = async () => {
    //   try {
    //     const [quizzesResponse, userStatsResponse] = await Promise.all([
    //       fetch('/api/admin/quizzes'),
    //       fetch('/api/admin/user-stats'),
    //     ]);

    //     if (quizzesResponse.ok && userStatsResponse.ok) {
    //       const quizzesData = await quizzesResponse.json();
    //       const userStatsData = await userStatsResponse.json();
    //       setQuizzes(quizzesData);
    //       setUserStats(userStatsData);
    //     } else {
    //       alert('Failed to fetch admin data. Please try again.');
    //     }
    //   } catch (error) {
    //     console.error('Fetch admin data error:', error);
    //     alert('An unexpected error occurred. Please try again later.');
    //   }
    // };

    // fetchAdminData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Quiz Management Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Quiz Management</h2>
            <p className="text-gray-600">Manage existing quizzes or create new ones</p>
          </div>
          <table className="min-w-full table-auto">
            <caption className="text-left text-gray-500 mb-2">List of Quizzes</caption>
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-left">Difficulty</th>
                <th className="px-4 py-2 text-left">Questions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz._id} className="border-b">
                  <td className="px-4 py-2">{quiz.subject}</td>
                  <td className="px-4 py-2">{quiz.difficulty}</td>
                  <td className="px-4 py-2">{quiz.questions.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/admin/create-quiz">
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">Create New Quiz</button>
          </Link>
        </div>

        {/* User Statistics Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">User Statistics</h2>
            <p className="text-gray-600">Overview of user performance</p>
          </div>
          <table className="min-w-full table-auto">
            <caption className="text-left text-gray-500 mb-2">User Performance</caption>
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Quizzes Taken</th>
                <th className="px-4 py-2 text-left">Average Score</th>
              </tr>
            </thead>
            <tbody>
              {userStats.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.quizzesTaken}</td>
                  <td className="px-4 py-2">{user.averageScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
