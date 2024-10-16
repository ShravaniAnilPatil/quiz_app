import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { FaChartBar, FaPlay, FaUser } from 'react-icons/fa';

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

    const fetchUserDataFromCSV = () => {
      fetch(`/quiz_results.csv?t=${new Date().getTime()}`)
        .then((response) => response.text())
        .then((data) => {
          Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              const userQuizzes = result.data.filter((row) => row.userName.trim() === username.trim());

              // Initialize counters for attempts and scores
              let easyAttempts = 0;
              let mediumAttempts = 0;
              let difficultAttempts = 0;
              let correctQuestions = 0;
              let incorrectQuestions = 0;

              userQuizzes.forEach((quiz) => {
                const { score, difficulty } = quiz;
                const scoreValue = parseInt(score, 10);

                // Increment attempts based on difficulty
                if (difficulty === 'Easy') easyAttempts++;
                if (difficulty === 'Medium') mediumAttempts++;
                if (difficulty === 'Difficult') difficultAttempts++;

                // Calculate correct and incorrect answers based on score
                const currentCorrect = Math.floor(scoreValue / 10); // Each 10 points represent one correct answer
                const currentIncorrect = 10 - currentCorrect; // Since each quiz has 10 questions

                correctQuestions += currentCorrect;
                incorrectQuestions += currentIncorrect;
              });

              // Calculate accuracy
              const totalQuestions = correctQuestions + incorrectQuestions;
              const accuracy = totalQuestions > 0 ? ((correctQuestions / totalQuestions) * 100).toFixed(2) : 0;

              // Update userData state
              setUserData({
                name: username,
                easyAttempts,
                mediumAttempts,
                difficultAttempts,
                correctQuestions,
                incorrectQuestions,
                accuracy
              });

              // Debugging output
              console.log("User Quizzes:", userQuizzes);
              console.log("Correct Answers:", correctQuestions);
              console.log("Incorrect Answers:", incorrectQuestions);
              console.log("Accuracy:", accuracy);
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

    const fetchSubjectsFromCSV = () => {
      fetch(`/questions.csv?t=${new Date().getTime()}`)
        .then((response) => response.text())
        .then((data) => {
          Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
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

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 shadow-md rounded-md py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white">
        Welcome, {userData.name}!
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quiz Statistics Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white text-center text-lg font-bold">
            Quiz Statistics
          </div>
          <div className="p-6">
            <p className="text-gray-500 mb-4 text-center">Your overall performance</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>Easy Level Attempts:</p>
                <p className="font-bold text-gray-700">{userData.easyAttempts}</p>
              </div>
              <div>
                <p>Medium Level Attempts:</p>
                <p className="font-bold text-gray-700">{userData.mediumAttempts}</p>
              </div>
              <div>
                <p>Difficult Level Attempts:</p>
                <p className="font-bold text-gray-700">{userData.difficultAttempts}</p>
              </div>
              <div>
                <p>Total Correct Answers:</p>
                <p className="font-bold text-green-600">{userData.correctQuestions}</p>
              </div>
              <div>
                <p>Total Incorrect Answers:</p>
                <p className="font-bold text-red-600">{userData.incorrectQuestions}</p>
              </div>
              <div>
                <p>Accuracy:</p>
                <p className="font-bold text-blue-600">{userData.accuracy}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 text-white text-center text-lg font-bold">
            Quick Actions
          </div>
          <div className="p-6 flex flex-col items-center space-y-4">
            <button
              className="bg-blue-500 text-white w-full py-3 rounded-lg flex items-center justify-center text-lg font-semibold hover:bg-blue-600 transition duration-300 shadow-md"
              onClick={() => navigate('/level-selection')}
            >
              <FaPlay className="mr-2" /> Start New Quiz
            </button>
            <button
              className="bg-gray-100 text-gray-800 w-full py-3 rounded-lg flex items-center justify-center text-lg font-semibold hover:bg-gray-200 transition duration-300 shadow-md"
              onClick={() => navigate('/profile')}
            >
              <FaUser className="mr-2" /> View Profile
            </button>
          </div>
        </div>
      </div>
      
      {/* Select a Subject Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Select a Subject</h2>
        <p className="text-gray-500 mb-8 text-center">Choose the subject you want to be quizzed on</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <button
              key={subject}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-full h-24 text-lg rounded-lg hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
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
