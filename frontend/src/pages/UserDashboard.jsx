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
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const username = localStorage.getItem('username'); 
    if (username) {
      setUserData(prevState => ({
        ...prevState,
        name: username
      }));
    }

    // Fetch user data from CSV for user statistics
    const fetchUserDataFromCSV = () => {
      fetch(`/quiz_results.csv?t=${new Date().getTime()}`) // Correct the file name (fixed typo)
        .then((response) => response.text())
        .then((data) => {
          Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              // Ensure correct field names are being used (userName and score)
              const userQuizzes = result.data.filter((row) => row.userName.trim() === username.trim());

              if (userQuizzes.length > 0) {
                const totalQuizzes = userQuizzes.length;
                const totalScore = userQuizzes.reduce((acc, quiz) => acc + parseFloat(quiz.score || 0), 0);
                const averageScore = (totalScore / totalQuizzes).toFixed(2);

                setUserData({
                  name: username,
                  totalQuizzes,
                  averageScore
                });
              }
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

    // Fetch the questions CSV for subject list
    const fetchSubjectsFromCSV = () => {
      fetch(`/questions.csv?t=${new Date().getTime()}`) 
        .then((response) => response.text())
        .then((data) => {
          Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              // Get unique subjects (assuming 'subject' field exists in the questions CSV)
              const uniqueSubjects = [...new Set(result.data.map((question) => question.subject).filter(subject => subject.trim() !== ""))];
              setSubjects(uniqueSubjects); 
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

    fetchUserDataFromCSV();
    fetchSubjectsFromCSV(); 
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
      
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Select a Subject</h2>
        <p className="text-gray-500 mb-6">Choose the subject you want to be quizzed on</p>
        <div className="grid grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <button
              key={subject}
              className="bg-blue-500 text-white w-full h-24 text-lg rounded hover:bg-blue-600 transition"
              onClick={() => navigate(`/level-selection?subject=${subject}`, { state: { subject } })}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
