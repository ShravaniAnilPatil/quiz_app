import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const levels = ['Easy', 'Medium', 'Hard'];

export default function LevelSelection() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { subject } = location.state || {}; // Retrieve subject from previous page

  const openModal = (level) => {
    setSelectedLevel(level);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const startQuiz = () => {
    navigate(`/quizpage`, { state: { selectedLevel, subject } });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 to-purple-500">
      <h1 className="text-4xl font-extrabold text-white mb-8">Select Difficulty Level for {subject} Quiz</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level) => (
          <button
            key={level}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-4 rounded-lg text-lg font-semibold shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={() => openModal(level)}
          >
            {level}
          </button>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4">Confirm Difficulty: {selectedLevel}</h2>
            <div className="flex justify-center">
              <button
                className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all duration-200 shadow-md mx-2"
                onClick={startQuiz}
              >
                Start Quiz
              </button>
              <button
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 shadow-md mx-2"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
