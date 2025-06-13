import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Home/Dashboard';
import Login from './components/Home/Login';
import Register from './components/Home/register';
import Home from './components/Home/Home';
import { AppProvider } from './Context/AppContext'; 
import './index.css';
import './style.css';

function App() {
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
		<AppProvider>
			<div className={darkMode ? 'dark bg-gray-900 text-white min-h-screen' : 'bg-white text-black min-h-screen'}>
				<Router>
					<div className="flex justify-end p-4">
						<button
							onClick={() => setDarkMode(!darkMode)}
							className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
						>
							Toggle {darkMode ? 'Light' : 'Dark'} Mode
						</button>
					</div>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/Home" element={<Home />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
					</Routes>
				</Router>
			</div>
		</AppProvider>
	);
}

export default App;
