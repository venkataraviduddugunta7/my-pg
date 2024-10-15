import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import './styles.css';

const MainApp = () => {
    const [username, setUsername] = useState(null); 
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });

    useEffect(() => {
        const checkAuth = () => {
            const isAuth = localStorage.getItem('isAuthenticated') === 'true';
            setIsAuthenticated(isAuth);
            if (isAuth) {
                setUsername(localStorage.getItem('username')); 
            }
        };
        checkAuth();
    }, []);

    const handleLogin = (username) => { 
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true'); 
        localStorage.setItem('username', username); 
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/login" 
                    element={<Login onSuccessfulLogin={handleLogin} />} 
                />
                {/* Protected Routes */}
                <Route
                path="/dashboard"
                element={isAuthenticated ? (
                    <Dashboard
                        username={localStorage.getItem('username')}
                        onLogout={handleLogout}
                    />
                ) : (
                    <Navigate to="/login" />
                )}
            />
            </Routes>
        </Router>
    );
};

export default MainApp;
