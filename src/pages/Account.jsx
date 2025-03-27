import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Account.css";
import {useNavigate} from "react-router-dom";

const Account = () => {
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    setError("Browsing in anonymous mode. Login to view your account information.");
                    localStorage.setItem("anonymous", "anonymous");
                    setLoading(false);
                    return;
                }
                const statsResponse = await axios.get(`/api/v1/users/${userId}/stats`);
                setUserStats(statsResponse.data);
            } catch (err) {
                console.error("Error fetching user data", err);
                setError("Error fetching user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleViewPosts = () => {
        navigate("/posts/postTitles?type=published");
    };

    const handleViewLikes = () => {
        navigate("/posts/postTitles?type=liked");
    };

    const handleViewDislikes = () => {
        navigate("/posts/postTitles?type=disliked");
    };

    return (
        <div className="page-container">
            <header className="app-header">
                <div className="header-content">
                    <h1 className="clickable-title" onClick={() => window.location.href = '/feed'}>Feed</h1>
                    <div className="header-buttons">
                        <button className="back-button" onClick={() => window.location.href = '/feed'}>Back to Feed</button>
                    </div>
                </div>
            </header>

            <div className="account-content">
                <div className="account-container">
                    <h2>Account Information</h2>

                    {loading && <div className="loading-spinner">Loading...</div>}

                    {error && localStorage.getItem("anonymous") === "anonymous" && (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    )}

                    {error && localStorage.getItem("anonymous") !== "anonymous" && (
                        <div className="error-message">
                            <p>{error}</p>
                            <button onClick={() => window.location.reload()}>Try Again</button>
                        </div>
                    )}

                    {userStats && !loading && !error && (
                        <>
                            <div className="account-details">
                                <div className="detail-row">
                                    <div className="detail-label">Username</div>
                                    <div className="detail-value">{userStats.username}</div>
                                </div>

                                <div className="detail-row">
                                    <div className="detail-label">Email</div>
                                    <div className="detail-value">{userStats.email}</div>
                                </div>

                                <div className="detail-row">
                                    <div className="detail-label">Account Created</div>
                                    <div className="detail-value">{formatDate(userStats.joinDate)}</div>
                                </div>
                            </div>

                            {userStats && (
                                <div className="account-stats">
                                    <h3>Activity Statistics</h3>
                                    <div className="stats-grid">
                                        <div className="stat-item clickable" onClick={handleViewPosts}>
                                            <div className="stat-value">{userStats.publishedPostsCount}</div>
                                            <div className="stat-label">Posts</div>
                                        </div>

                                        <div className="stat-item clickable" onClick={handleViewLikes}>
                                            <div className="stat-value">{userStats.likedPostsCount}</div>
                                            <div className="stat-label">Likes</div>
                                        </div>

                                        <div className="stat-item clickable" onClick={handleViewDislikes}>
                                            <div className="stat-value">{userStats.dislikedPostsCount}</div>
                                            <div className="stat-label">Dislikes</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-value">{userStats.publishedCommentsCount}</div>
                                            <div className="stat-label">Comments</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Account;