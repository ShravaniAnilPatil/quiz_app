import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import mathData from '../data/MathData'

const levels = ['Easy', 'Medium', 'Hard']
const quizName = "General Knowledge"

export default function LevelSelection() {
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const openModal = (level) => {
    setSelectedLevel(level)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const startQuiz = () => {
    const questions = mathData[selectedLevel]
    navigate(`/quizpage?level=${selectedLevel}`, { state: { questions } })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Select Level for {quizName} Quiz</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level) => (
          <button
            key={level}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => openModal(level)}
          >
            {level}
          </button>
        ))}
      </div>
      {isModalOpen && (
        <div className=" ">
         <div className="flex justify-center my-5">
            <h2 className="text-xl font-bold mb-4">Confirm Level: {selectedLevel}</h2>
            </div>
            <div className=" flex justify-center ">
            <button
              className="bg-green-500 text-white px-4 py-2 mx-4 rounded hover:bg-green-600 transition"
              onClick={startQuiz}
            >
              Start Quiz
            </button>
         
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              onClick={closeModal}
            >
              Cancel
            </button>
            </div>
          
        </div>
      )}
    </div>
  )
}