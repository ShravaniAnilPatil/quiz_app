import React, { useState, useEffect } from "react";
import Papa from "papaparse"; 
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  
  const navigate = useNavigate(); // Add navigation if needed after successful login

  useEffect(() => {
    const loadUsersFromCSV = () => {
      fetch(`/user.csv?t=${new Date().getTime()}`) // Append timestamp to prevent caching
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
              console.log(result.data); // Log users to see the structure
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

    // Check the headers of the CSV file and adjust accordingly
    const user = users.find(
      (u) => u.name === username && u.password === password // Adjust 'u.user' to match the CSV header
    );

    if (user) {
      setError("");
      alert("Login successful!");
      navigate("/dashboard"); // Navigate to another page after login
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
