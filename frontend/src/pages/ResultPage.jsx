import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Papa from 'papaparse'

export default function ResultPage() {
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboardData, setLeaderboardData] = useState([])

  // Mock result data
  const score = 8
  const totalQuestions = 10

  // Function to fetch and parse the leaderboard CSV
  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('/user_scores.csv') // Adjust this path if needed
      const csvText = await response.text()

      // Use PapaParse to parse the CSV data
      Papa.parse(csvText, {
        header: true,
        complete: (result) => {
          const data = result.data
            .filter((entry) => entry.userName && entry.score) // Filter out empty entries
            .map((entry) => ({
              ...entry,
              score: parseInt(entry.score, 10) // Convert score to number
            }))

          // Sort by score in descending order
          const sortedData = data.sort((a, b) => b.score - a.score)

          // Add rank to each entry
          sortedData.forEach((entry, index) => {
            entry.rank = index + 1
          })

          setLeaderboardData(sortedData)
        },
        error: (error) => {
          console.error('Error parsing CSV:', error)
        }
      })
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }

  useEffect(() => {
    if (showLeaderboard) {
      fetchLeaderboardData() // Fetch data when leaderboard is shown
    }
  }, [showLeaderboard])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Result Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center">Quiz Results</h2>
        <p className="text-center text-gray-500">Here's how you performed</p>
        <div className="mt-4 text-3xl font-bold text-center">
          Your Score: {score}/{totalQuestions}
        </div>
        <p className="text-center mt-4 text-lg">
          You answered {score} out of {totalQuestions} questions correctly.
        </p>
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            {showLeaderboard ? "Hide Leaderboard" : "View Leaderboard"}
          </button>
          <Link to="/">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              Try Another Quiz
            </button>
          </Link>
        </div>
      </div>

      {/* Leaderboard */}
      {showLeaderboard && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-8">
          <h3 className="text-xl font-bold text-center">Leaderboard</h3>
          <p className="text-center text-gray-500">Top performers in this quiz</p>
          <table className="min-w-full mt-4 border-collapse">
            <thead>
              <tr>
                <th className="border-b px-4 py-2 text-left text-gray-600">Rank</th>
                <th className="border-b px-4 py-2 text-left text-gray-600">Name</th>
                <th className="border-b px-4 py-2 text-left text-gray-600">Score</th>
                <th className="border-b px-4 py-2 text-left text-gray-600">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr key={index}>
                  <td className="border-b px-4 py-2">{entry.rank}</td>
                  <td className="border-b px-4 py-2">{entry.userName}</td>
                  <td className="border-b px-4 py-2">{entry.score}</td>
                  <td className="border-b px-4 py-2">{entry.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
