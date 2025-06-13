import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      if (res.status === 200) {
        Swal.fire("Success", "Login successful!", "success");
        localStorage.setItem("token", res.data.token); // optional
        navigate("/dashboard");
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Login failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none"
              required
            />
          </div>

          {/* Buttons container */}
          <div className="flex justify-between mt-6 space-x-3">
            <button
              type="submit"
              className="flex-1 py-3 px-5 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="flex-1 py-3 px-5 bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 py-3 px-5 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
