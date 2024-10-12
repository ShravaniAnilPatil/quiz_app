import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function UserDashboard() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    name: 'John Doe',
    totalQuizzes: 10,
    averageScore: 85
  })
  const subjects = ['Math', 'Science', 'History', 'Literature']

  useEffect(() => {
    const fetchUserData = async () => {
    //   try {
    //     const response = await fetch('/api/user-data', {
    //       headers: {
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`
    //       }
    //     })
    //     if (response.ok) {
    //       const data = await response.json()
    //       setUserData(data)
    //     } else {
    //       alert("Failed to fetch user data. Please try again.")
    //     }
    //   } catch (error) {
    //     console.error('Fetch user data error:', error)
    //     alert("An unexpected error occurred. Please try again later.")
    //   }
    }

    fetchUserData()
  }, [])

//   if (!userData) {
//     return <div>Loading...</div>
//   }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome, {userData.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quiz Statistics Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-bold mb-2">Quiz Statistics</h2>
          <p className="text-gray-500 mb-4">Your overall performance</p>
          <p>Total Quizzes Taken: {userData.totalQuizzes}</p>
          <p>Average Score: {userData.averageScore}%</p>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-bold mb-2">Quick Actions</h2>
          <p className="text-gray-500 mb-4">Start a new quiz or view your profile</p>
          <div className="flex flex-col space-y-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => navigate('/subject-selection')}
            >
              Start New Quiz
            </button>
            <button
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition"
              onClick={() => navigate('/profile')}
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Select a Subject</h2>
        <p className="text-gray-500 mb-6">Choose the subject you want to be quizzed on</p>
        <div className="grid grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <button
              key={subject}
              className="bg-blue-500 text-white w-full h-24 text-lg rounded hover:bg-blue-600 transition"
              onClick={() => navigate(`/level-selection?subject=${subject}`)}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}