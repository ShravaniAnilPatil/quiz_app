import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { useNavigate, Link } from "react-router-dom"; // Combined imports
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsersFromCSV = () => {
      fetch(`/user.csv?t=${new Date().getTime()}`) 
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((data) => {
          Papa.parse(data, {
            header: true,
            complete: (result) => {
              setUsers(result.data);
            },
          });
        })
        .catch((error) => {
          console.error("Error loading the CSV file:", error);
        });
    };

    loadUsersFromCSV();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.name.trim() === username.trim() && u.password.trim() === password.trim() 
    );

    if (user) {
      setError("");
      localStorage.setItem("username", user.name);

      const quizData = {
        correctAnswers: 0,  
        incorrectAnswers: 0,  
      };

      try {
        const response = await axios.post('http://localhost:5000/api/update-user', {
          username,
          quizData,
        });
        console.log('User report updated successfully:', response.data);
        alert("Login successful!");
        navigate("/user-dashboard"); 
      } catch (error) {
        console.error('Error updating user report:', error);
      }
      
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
