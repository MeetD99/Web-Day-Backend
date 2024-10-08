import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../src/Admin.css'; // Import the CSS file for styling

const Admin = () => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);
    const [LBButtonClicked, setLBButtonClicked] = useState(false);
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    const backendRoute = import.meta.env.VITE_BACKEND_ROUTE;

    useEffect(() => {
        setLBButtonClicked(false);
    }, []); // Adding an empty dependency array to run the effect only once on mount

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = () => {
        if (password === correctPassword) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect password. Please try again.');
        }
    };

    const handleClearUsers = async () => {
        try {
            await axios.delete(`${backendRoute}/clear`);
            alert('All users cleared successfully.');
            setLeaderboard([]); // Clear leaderboard after users are deleted
            setLBButtonClicked(true);
        } catch (error) {
            console.error('Error clearing users:', error);
            alert('Failed to clear users.');
        }
    };

    const handleShowLeaderboard = async () => {
        try {
            const response = await axios.get(`${backendRoute}/`);
            setLeaderboard(response.data.users); // Update state with leaderboard data
            setLBButtonClicked(true);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            alert('Failed to fetch leaderboard.');
        }
    };

    return (
        <div className="admin-container">
            {!isAuthenticated ? (
                <div className="login-container">
                    <h2>Admin Login</h2>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter admin password"
                        className="password-input"
                    />
                    <button onClick={handleLogin} className="login-button">Login</button>
                    {error && <p className="error-message">{error}</p>}
                </div>
            ) : (
                <div className="admin-actions">
                    <button onClick={handleClearUsers} className="action-button clear-button">Clear Users</button>
                    <button onClick={handleShowLeaderboard} className="action-button leaderboard-button">Show Leaderboard</button>

                    {LBButtonClicked && (
                        leaderboard.length > 0 ? (
                            <div className="leaderboard-table">
                                <h3>Leaderboard</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Roll Number</th>
                                            <th>Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboard.map((user, index) => (
                                            <tr key={index}>
                                                <td>{user.name}</td>
                                                <td>{user.rollNo}</td>
                                                <td>{user.score}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <h2>No Users Yet!</h2>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default Admin;
