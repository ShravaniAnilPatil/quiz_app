export default function ProfilePage() {
    
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      quizHistory: [
        { date: "2023-06-01", subject: "Math", score: 8, totalQuestions: 10 },
        { date: "2023-06-02", subject: "Science", score: 7, totalQuestions: 10 },
        
      ],
    }
  
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>
          <p className="text-gray-600">Your account details and quiz history</p>
  
          {/* Account Information */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Account Information</h3>
            <p>Name: {userData.name}</p>
            <p>Email: {userData.email}</p>
          </div>
  
          {/* Quiz History */}
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
    )
  }
  