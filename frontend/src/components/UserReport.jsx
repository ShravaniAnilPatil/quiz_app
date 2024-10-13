import React, { useState, useEffect } from "react";
import Papa from "papaparse"; 

const QuizComponent = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [username, setUsername] = useState(""); 
  const [questions, setQuestions] = useState([]); 

  useEffect(() => {
    setUsername("john"); 
  }, []);

  const handleAnswer = (isCorrect) => {
    setAttempts(attempts + 1);
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const percentage = (correctAnswers / attempts) * 100;
      const accuracy = (correctAnswers / questions.length) * 100;
      updateUserReport(username, attempts, correctAnswers, accuracy, percentage);
    }
  };

  const updateUserReport = (username, attempts, correctAnswers, accuracy, percentage) => {
    fetch("/userreport.csv")
      .then((response) => response.text())
      .then((data) => {
        Papa.parse(data, {
          header: true,
          complete: (result) => {
            const reports = result.data;

            let existingUserReport = reports.find((report) => report.name === username);

            if (existingUserReport) {

              existingUserReport.attempts = parseInt(existingUserReport.attempts) + attempts;
              existingUserReport.correctAnswers =
                parseInt(existingUserReport.correctAnswers) + correctAnswers;
              existingUserReport.accuracy = (
                (parseFloat(existingUserReport.accuracy) + accuracy) / 2
              ).toFixed(2);
              existingUserReport.percentage = (
                (parseFloat(existingUserReport.percentage) + percentage) / 2
              ).toFixed(2);
            } else {
              reports.push({
                name: username,
                attempts,
                correctAnswers,
                accuracy: accuracy.toFixed(2),
                percentage: percentage.toFixed(2),
              });
            }
            const csv = Papa.unparse(reports);
            saveUserReportCSV(csv);
          },
        });
      })
      .catch((error) => console.error("Error loading report CSV:", error));
  };

  const saveUserReportCSV = (csvContent) => {
    fetch("/save-userreport", {
      method: "POST",
      headers: {
        "Content-Type": "text/csv",
      },
      body: csvContent,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("CSV report saved:", data);
      })
      .catch((error) => console.error("Error saving CSV report:", error));
  };

  return (
    <div>
      <button onClick={() => handleAnswer(true)}>Correct Answer</button>
      <button onClick={() => handleAnswer(false)}>Wrong Answer</button>
    </div>
  );
};

export default QuizComponent;
