import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setIsLoggedIn(true);
      setUsername(loggedInUser);
    }
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleStartQuiz = () => {
    if (isLoggedIn) {
      navigate("/quiz"); 
    } else {
      navigate("/login"); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-400 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Welcome {isLoggedIn ? `back, ${username}!` : "to the Quiz Platform!"}
        </h1>
        <p className="text-lg text-white mb-8">
          {isLoggedIn
            ? "Are you ready to test your knowledge? Click below to start the quiz!"
            : "Please login to start the quiz and track your progress."}
        </p>
        <button
          onClick={handleStartQuiz}
          className="px-8 py-4 bg-white text-blue-500 font-semibold rounded-lg shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
        >
          {isLoggedIn ? "Start Quiz" : "Login to Start Quiz"}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
