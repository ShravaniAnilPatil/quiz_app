import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Papa from "papaparse";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function QuizPage() {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { subject, selectedLevel } = state || {};

  useEffect(() => {
    if (subject && selectedLevel) {
      fetchQuizDataFromCSV(subject, selectedLevel);
    }
  }, [subject, selectedLevel]);

  const fetchQuizDataFromCSV = (subject, level) => {
    fetch(`/questions.csv?t=${new Date().getTime()}`)
      .then((response) => response.text())
      .then((data) => {
        Papa.parse(data, {
          header: true,
          complete: (result) => {
            const questions = result.data.filter(
              (q) => q.subject === subject && q.level === level
            );
            // Ensure options are parsed as arrays
            const formattedQuestions = questions.map((q) => ({
              ...q,
              options: q.options ? q.options.split('|') : []
            }));
            console.log(formattedQuestions);
            setQuizData(formattedQuestions);
          },
          error: (err) => {
            console.error("Error reading CSV:", err);
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching CSV file:", error);
      });
  };

  const handleNext = () => {
    const correctAnswer = quizData[currentQuestion].correctAnswer;
    setUserAnswers([...userAnswers, selectedAnswer]);

    if (selectedAnswer === correctAnswer) {
      setCorrectAnswers(correctAnswers + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer("");
        setIsCorrect(null);
      } else {
        submitQuiz();
      }
    }, 1500);
  };

  const submitQuiz = () => {
    const score = Math.round((correctAnswers / (quizData.length)) * 100);

    const quizResult = {
      userName: localStorage.getItem("username") || "Guest",
      score,
      difficulty: selectedLevel,
      subject,
    };

    fetch("http://localhost:5000/submit-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizResult),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to submit quiz');
        }
        return response.json();
      })
      .then((data) => {
        
        console.log('Success:', data);
        navigate(`/result?score=${score}`, {
          state: { subject, selectedLevel },
        });
      })
      .catch((error) => {
        console.error("Error submitting quiz:", error);
        alert("Failed to submit quiz. Please try again later.");
      });
    
  };

  if (quizData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">
          Question {currentQuestion + 1}
        </h2>
        <p className="text-gray-500 mb-6">
          {quizData[currentQuestion].question}
        </p>
        <div className="mb-4">
          {Array.isArray(quizData[currentQuestion].options) &&
            quizData[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="radio"
                  name="quiz-option"
                  id={`option-${index}`}
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => setSelectedAnswer(option)}
                  className="text-blue-500 focus:ring-blue-400"
                />
                <label htmlFor={`option-${index}`} className="text-gray-700">
                  {option}
                </label>
                {selectedAnswer && option === selectedAnswer && (
                  <span className="ml-2">
                    {isCorrect === null ? null : isCorrect &&
                      option === quizData[currentQuestion].correctAnswer ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </span>
                )}
              </div>
            ))}
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={handleNext}
          disabled={!selectedAnswer}
        >
          {currentQuestion === quizData.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}