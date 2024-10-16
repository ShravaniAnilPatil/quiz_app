import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa"; // Added icons

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

  const handleLogin = (e) => {
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

      localStorage.setItem("quizData", JSON.stringify(quizData));

      console.log("User report stored successfully:", quizData);
      alert("Login successful!");
      navigate("/user-dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-400 via-blue-300 to-blue-200">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-sm w-full transform transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <label className="block text-gray-600 mb-2 font-semibold">Username</label>
            <div className="flex items-center border rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-purple-400">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full outline-none"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-gray-600 mb-2 font-semibold">Password</label>
            <div className="flex items-center border rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-purple-400">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition duration-300 shadow-lg"
          >
            Login
          </button>
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
