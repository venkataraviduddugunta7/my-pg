import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import './styles.css';

const MainApp = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); 

    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/login" 
                    element={<Login onSuccessfulLogin={() => setIsAuthenticated(true)} />} 
                />
                <Route path="/" element={<h1>Welcome to My App</h1>} />
                {/* Protected Route */}
                <Route
                    path="/dashboard"
                    element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
                />
            </Routes>
        </Router>
    );
};

export default MainApp;