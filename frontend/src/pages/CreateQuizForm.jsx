import { useState } from 'react';

export default function CreateQuizForm() {
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field.startsWith('option')) {
      const optionIndex = parseInt(field.slice(-1)) - 1;
      newQuestions[index].options[optionIndex] = value;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Quiz data:', {
      title: e.target.title.value,
      category: e.target.category.value,
      difficulty: e.target.difficulty.value,
      questions,
    });
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className=" bg-gray-200 text-black shadow-lg rounded-lg p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Create New Quiz</h2>
          <p className="text-black">Add a new quiz to the system by filling in the required details below.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Quiz Title */}
            <div>
              <label htmlFor="title" className="block text-lg font-medium">Quiz Title</label>
              <input
                id="title"
                name="title"
                className="mt-2 block w-full px-4 py-2 border border-black rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the quiz title"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-lg font-medium">Category</label>
              <select
                name="category"
                className="mt-2 block w-full px-4 py-2 border border-black rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select category</option>
                <option value="math">Math</option>
                <option value="science">Science</option>
                <option value="history">History</option>
                <option value="literature">Literature</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-lg font-medium">Difficulty</label>
              <select
                name="difficulty"
                className="mt-2 block w-full px-4 py-2 border border-black rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Questions */}
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex">
                <label className="block text-lg font-medium mb-2">Question {qIndex + 1}</label>
                <button
                  type="button"
                  onClick={()=>removeQuestion(qIndex)}
                  className="ml-auto text-red-500"
                >X</button>
                </div>
                <textarea
                  placeholder={`Enter Question ${qIndex + 1}`}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                  className="w-full border border-black rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  required
                />

                {q.options.map((option, oIndex) => (
                  <input
                    key={oIndex}
                    placeholder={`Option ${oIndex + 1}`}
                    value={option}
                    onChange={(e) => handleQuestionChange(qIndex, `option${oIndex + 1}`, e.target.value)}
                    className="w-full border border-black rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    required
                  />
                ))}

                <label className="block text-lg font-medium mt-4">Select Correct Answer</label>
                <select
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                  className="block w-full px-4 py-2 border border-black rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                  required
                >
                  <option value="">Select correct answer</option>
                  {q.options.map((_, index) => (
                    <option key={index} value={`option${index + 1}`}>Option {index + 1}</option>
                  ))}
                </select>
              </div>
            ))}

            {/* Add Question Button */}
            <button
              type="button"
              onClick={addQuestion}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 ease-in-out"
            >
              Add Question
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out"
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
