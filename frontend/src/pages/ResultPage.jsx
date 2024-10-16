import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Papa from 'papaparse';

export default function ResultPage() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const location = useLocation();
  const { selectedLevel, subject } = location.state || {}; // Retrieve both selectedLevel and subject
  
  const queryParams = new URLSearchParams(location.search);
  const score_x = parseInt(queryParams.get('score')) || 0; 
  const score = score_x/10

  const totalQuestions = 10; 

  // Function to fetch and parse the leaderboard CSV
  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('/quiz_results.csv'); // Adjust this path if needed
      const csvText = await response.text();
      
      // Use PapaParse to parse the CSV data
      Papa.parse(csvText, {
        header: true,
        complete: (result) => {
          const data = result.data
            .filter(
              (entry) => entry.userName && entry.difficulty && entry.subject && entry.score != undefined && entry.score != null
            )
            .map((entry) => ({
              ...entry,
              score: parseInt(entry.score, 10), // Convert score to number
            }))
            .filter(
              (entry) =>
                entry.difficulty === selectedLevel && // Filter by difficulty
                entry.subject === subject // Filter by subject
            );

          // Sort by score in descending order
          const sortedData = data.sort((a, b) => b.score - a.score);

          // Add rank to each entry
          sortedData.forEach((entry, index) => {
            entry.rank = index + 1;
          });

          setLeaderboardData(sortedData);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        },
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  useEffect(() => {
    if (showLeaderboard) {
      fetchLeaderboardData(); 
    }
  }, [showLeaderboard]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Quiz Results</h2>
        <p className="text-gray-500 mb-6">Here's how you performed</p>
        <div className="mt-4 text-3xl font-bold text-blue-600">
          Your Score: {score}/{totalQuestions}
        </div>
        <p className="text-center mt-4 text-lg">
          You answered {score} out of {totalQuestions} questions correctly.
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            {showLeaderboard ? 'Hide Leaderboard' : 'View Leaderboard'}
          </button>
          <Link to="/user-dashboard">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              Try Another Quiz
            </button>
          </Link>
        </div>
      </div>

      {/* Leaderboard */}
      {showLeaderboard && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-8">
          <h3 className="text-xl font-bold text-center mb-4">Leaderboard</h3>
          <p className="text-center text-gray-500 mb-4">Top performers in the {selectedLevel} - {subject} quiz</p>
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b px-4 py-2 text-left text-gray-600">Rank</th>
                <th className="border-b px-4 py-2 text-left text-gray-600">Name</th>
                <th className="border-b px-4 py-2 text-left text-gray-600">Score</th>
                <th className="border-b px-4 py-2 text-left text-gray-600">Difficulty</th>
                <th className="border-b px-4 py-2 text-left text-gray-600">Subject</th> {/* New Column */}
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr key={index}>
                  <td className="border-b px-4 py-2">{entry.rank}</td>
                  <td className="border-b px-4 py-2">{entry.userName}</td>
                  <td className="border-b px-4 py-2">{entry.score}</td>
                  <td className="border-b px-4 py-2">{entry.difficulty}</td>
                  <td className="border-b px-4 py-2">{entry.subject}</td> {/* New Data */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
