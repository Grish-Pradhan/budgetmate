import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/register", { name, email, password });
      if (res.status === 201) {
        Swal.fire("Success", "Registered successfully!", "success");
        navigate("/dashboard");
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Registration failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          Create a new account
        </h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none"
              required
            />
          </div>

          {/* Buttons container with 3 buttons */}
          <div className="flex justify-between mt-4 space-x-2">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded"
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
            >
              Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
