import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    easyAttempts: 0,
    mediumAttempts: 0,
    difficultAttempts: 0,
    correctQuestions: 0,
    incorrectQuestions: 0,
    accuracy: 0
  });
  const subjects = ['Math', 'Science', 'History', 'Literature'];

  useEffect(() => {
    const username = localStorage.getItem('username');

    if (!username) {
      console.error("Username not found in localStorage");
      return;
    }

    setUserData(prevState => ({
      ...prevState,
      name: username
    }));

    // Fetch user report data from userreport.csv
    const fetchUserReportFromCSV = () => {
      fetch(`/userreport.csv?t=${new Date().getTime()}`)
        .then(response => response.text())
        .then(data => {
          Papa.parse(data, {
            header: true,
            complete: result => {
              console.log("Parsed userreport.csv:", result.data); // Debug log

              const userReport = result.data.find(u => u.name?.trim().toLowerCase() === username.trim().toLowerCase());

              if (userReport) {
                const totalAttempts =
                  parseInt(userReport.easy_attempts, 10) +
                  parseInt(userReport.medium_attempts, 10) +
                  parseInt(userReport.difficult_attempts, 10);

                const totalCorrect =
                  parseInt(userReport.easy_correct, 10) +
                  parseInt(userReport.medium_correct, 10) +
                  parseInt(userReport.difficult_correct, 10);

                const totalIncorrect =
                  parseInt(userReport.easy_incorrect, 10) +
                  parseInt(userReport.medium_incorrect, 10) +
                  parseInt(userReport.difficult_incorrect, 10);

                const accuracy = totalAttempts > 0 ? ((totalCorrect / totalAttempts) * 100).toFixed(2) : 0;

                setUserData(prevState => ({
                  ...prevState,
                  easyAttempts: parseInt(userReport.easy_attempts, 10) || 0,
                  mediumAttempts: parseInt(userReport.medium_attempts, 10) || 0,
                  difficultAttempts: parseInt(userReport.difficult_attempts, 10) || 0,
                  correctQuestions: totalCorrect,
                  incorrectQuestions: totalIncorrect,
                  accuracy: accuracy
                }));
              } else {
                console.error(`User ${username} not found in userreport.csv`);
              }
            },
            error: err => {
              console.error("Error reading the CSV file", err);
            }
          });
        })
        .catch(error => {
          console.error('Error fetching the CSV file:', error);
        });
    };

    fetchUserReportFromCSV();
  }, []);

  // Function to update the CSV file after a quiz is completed
  const updateUserReportInCSV = (difficulty, correctAnswers, incorrectAnswers) => {
    fetch(`/userreport.csv?t=${new Date().getTime()}`)
      .then(response => response.text())
      .then(data => {
        Papa.parse(data, {
          header: true,
          complete: result => {
            const userRecords = result.data;
            const username = localStorage.getItem('username');

            const userRecord = userRecords.find(u => u.name?.trim().toLowerCase() === username.trim().toLowerCase());

            if (userRecord) {
              // Update user's data based on quiz results
              if (difficulty === 'easy') {
                userRecord.easy_attempts = parseInt(userRecord.easy_attempts, 10) + 1;
                userRecord.easy_correct = parseInt(userRecord.easy_correct, 10) + correctAnswers;
                userRecord.easy_incorrect = parseInt(userRecord.easy_incorrect, 10) + incorrectAnswers;
              } else if (difficulty === 'medium') {
                userRecord.medium_attempts = parseInt(userRecord.medium_attempts, 10) + 1;
                userRecord.medium_correct = parseInt(userRecord.medium_correct, 10) + correctAnswers;
                userRecord.medium_incorrect = parseInt(userRecord.medium_incorrect, 10) + incorrectAnswers;
              } else if (difficulty === 'difficult') {
                userRecord.difficult_attempts = parseInt(userRecord.difficult_attempts, 10) + 1;
                userRecord.difficult_correct = parseInt(userRecord.difficult_correct, 10) + correctAnswers;
                userRecord.difficult_incorrect = parseInt(userRecord.difficult_incorrect, 10) + incorrectAnswers;
              }

              // Convert updated data back to CSV format and update the CSV file
              const updatedCSV = Papa.unparse(userRecords);
              fetch('/update-userreport', {
                method: 'POST',
                headers: { 'Content-Type': 'text/csv' },
                body: updatedCSV
              })
              .then(response => {
                if (response.ok) {
                  console.log("User report updated successfully");
                } else {
                  console.error("Error updating user report");
                }
              })
              .catch(error => {
                console.error("Error updating the CSV file:", error);
              });
            }
          }
        });
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome, {userData.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quiz Statistics Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-bold mb-2">Quiz Statistics</h2>
          <p className="text-gray-500 mb-4">Your overall performance</p>
          <p>Easy Level Attempts: {userData.easyAttempts}</p>
          <p>Medium Level Attempts: {userData.mediumAttempts}</p>
          <p>Difficult Level Attempts: {userData.difficultAttempts}</p>
          <p>Total Correct Answers: {userData.correctQuestions}</p>
          <p>Total Incorrect Answers: {userData.incorrectQuestions}</p>
          <p>Accuracy: {userData.accuracy}%</p>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-bold mb-2">Quick Actions</h2>
          <p className="text-gray-500 mb-4">Start a new quiz or view your profile</p>
          <div className="flex flex-col space-y-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => navigate('/level-selection')}
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
    </div>
  );
}
