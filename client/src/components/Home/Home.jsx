import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text min-h-screen transition-colors duration-300">
      <header className="bg-white dark:bg-[#2a2a2a] shadow p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo1.png" alt="BudgetMate Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-purple-600">BudgetMate</span>
        </div>
        <nav className="flex gap-4 items-center">
          <Link to="/login" className="font-semibold">Login</Link>
          <Link to="/register" className="font-semibold">Register</Link>
          {/* Dark mode toggle button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-2 p-2 rounded border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
        </nav>
      </header>

      <section className="text-center px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-600">Master Your Money, The Smart Way</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Welcome to BudgetMate – Your all-in-one personal finance dashboard. Track expenses, create budgets, and gain full control of your financial life.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/login" className="bg-purple-600 text-white px-6 py-3 rounded font-semibold">Login</Link>
          <Link to="/register" className="bg-green-500 text-white px-6 py-3 rounded font-semibold">Get Started</Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-8 py-16">
        <div className="bg-white dark:bg-[#2c2c2c] rounded-xl shadow-md p-6 text-center">
          <h3 className="text-xl font-bold text-purple-600 mb-2">📊 Real-Time Insights</h3>
          <p>Track your expenses and income in real-time with beautiful charts and graphs.</p>
        </div>
        <div className="bg-white dark:bg-[#2c2c2c] rounded-xl shadow-md p-6 text-center">
          <h3 className="text-xl font-bold text-purple-600 mb-2">💡 Smart Budgeting</h3>
          <p>Create monthly budgets, set goals, and get intelligent tips to save more.</p>
        </div>
        <div className="bg-white dark:bg-[#2c2c2c] rounded-xl shadow-md p-6 text-center">
          <h3 className="text-xl font-bold text-purple-600 mb-2">🔐 Secure & Private</h3>
          <p>All your data is encrypted and stored securely — only you can access it.</p>
        </div>
        <div className="bg-white dark:bg-[#2c2c2c] rounded-xl shadow-md p-6 text-center">
          <h3 className="text-xl font-bold text-purple-600 mb-2">📁 Easy Export</h3>
          <p>Export your financial reports in CSV or PDF formats for your own records.</p>
        </div>
      </section>

      <footer className="bg-white dark:bg-[#2a2a2a] text-center py-6 text-sm text-gray-500 dark:text-gray-300">
        &copy; 2025 BudgetMate. Designed with 💜 for smarter finance.
      </footer>
    </div>
  );
};

export default Home;
