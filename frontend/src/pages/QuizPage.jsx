// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'

// export default function QuizPage() {
//   const [quizData, setQuizData] = useState([])
//   const [currentQuestion, setCurrentQuestion] = useState(0)
//   const [selectedAnswer, setSelectedAnswer] = useState("")
//   const [userAnswers, setUserAnswers] = useState([])
//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchQuizData = async () => {
//     //   try {
//     //     const response = await fetch('/api/quiz?id=someQuizId') // Replace with actual quiz ID
//     //     if (response.ok) {
//     //       const data = await response.json()
//     //       setQuizData(data.questions)
//     //     } else {
//     //       alert("Failed to fetch quiz data. Please try again.")
//     //     }
//     //   } catch (error) {
//     //     console.error('Fetch quiz error:', error)
//     //     alert("An unexpected error occurred. Please try again later.")
//     //   }
//     }

//     fetchQuizData()
//   }, [])

//   const handleNext = () => {
//     setUserAnswers([...userAnswers, selectedAnswer])
//     if (currentQuestion < quizData.length - 1) {
//       setCurrentQuestion(currentQuestion + 1)
//       setSelectedAnswer("")
//     } else {
//       submitQuiz()
//     }
//   }

//   const submitQuiz = async () => {
//     // try {
//     //   const response = await fetch('/api/submit-quiz', {
//     //     method: 'POST',
//     //     headers: { 'Content-Type': 'application/json' },
//     //     body: JSON.stringify({ quizId: 'someQuizId', answers: [...userAnswers, selectedAnswer] }),
//     //   })
//     //   if (response.ok) {
//     //     const result = await response.json()
//     //     navigate(`/result?score=${result.score}`)
//     //   } else {
//     //     alert("Failed to submit quiz. Please try again.")
//     //   }
//     // } catch (error) {
//     //   console.error('Submit quiz error:', error)
//     //   alert("An unexpected error occurred. Please try again later.")
//     // }
//     // }
// }

// //   if (quizData.length === 0) {
// //     return <div>Loading...</div>
// //   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-2xl font-bold mb-2">Question {currentQuestion + 1}</h2>
//         <p className="text-gray-500 mb-6">{quizData[currentQuestion].question}</p>
//         <div className="mb-4">
//           {quizData[currentQuestion].options.map((option, index) => (
//             <div key={index} className="flex items-center space-x-2 mb-2">
//               <input
//                 type="radio"
//                 name="quiz-option"
//                 id={`option-${index}`}
//                 value={option}
//                 checked={selectedAnswer === option}
//                 onChange={() => setSelectedAnswer(option)}
//                 className="text-blue-500 focus:ring-blue-400"
//               />
//               <label htmlFor={`option-${index}`} className="text-gray-700">{option}</label>
//             </div>
//           ))}
//         </div>
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
//           onClick={handleNext}
//           disabled={!selectedAnswer}
//         >
//           {currentQuestion === quizData.length - 1 ? "Finish" : "Next"}
//         </button>
//       </div>
//     </div>
//   )
// }
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import mathQuizData from '../data/MathData'

export default function QuizPage() {
  const [quizData, setQuizData] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [userAnswers, setUserAnswers] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location
  const { questions } = state || {}

  useEffect(() => {
    if (questions) {
      setQuizData(questions)
    } else {
      // Fallback to default level if no questions are passed
      setQuizData(mathQuizData.Easy)
    }
  }, [questions])

  const handleNext = () => {
    setUserAnswers([...userAnswers, selectedAnswer])
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
    } else {
      submitQuiz()
    }
  }

  const submitQuiz = async () => {
    // Handle quiz submission logic here
    // For now, just navigate to a result page with a dummy score
    navigate(`/result?score=100`)
  }

  if (quizData.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Question {currentQuestion + 1}</h2>
        <p className="text-gray-500 mb-6">{quizData[currentQuestion].question}</p>
        <div className="mb-4">
          {quizData[currentQuestion].options.map((option, index) => (
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
              <label htmlFor={`option-${index}`} className="text-gray-700">{option}</label>
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
  )
}