import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./PostTitles.css";

const PostTitles = () => {
    const [postIds, setPostIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageTitle, setPageTitle] = useState("Posts");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const searchParams = new URLSearchParams(location.search);
                const postType = searchParams.get("type");

                switch (postType) {
                    case "liked":
                        setPageTitle("Liked Posts");
                        break;
                    case "disliked":
                        setPageTitle("Disliked Posts");
                        break;
                    case "published":
                        setPageTitle("Published Posts");
                        break;
                    default:
                        setPageTitle("Posts");
                }

                const response = await axios.get(`/api/v1/users/${userId}/${postType}`);
                //console.log("API Response:", response.data);
                setPostIds(response.data || []);

            } catch (err) {
                console.error(`Error fetching ${pageTitle}:`, err);
                setError(`Error fetching ${pageTitle.toLowerCase()}: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [location.search]);

    const navigateToPostType = (type) => {
        navigate(`/posts/postTitles?type=${type}`);
    };

    const handleBackToAccount = () => {
        navigate("/account");
    };

    return (
        <div className="page-container">
            <header className="app-header">
                <div className="header-content">
                    <div className="header-spacing"></div>
                    <h1 className="clickable-title" onClick={() => window.location.href = '/feed'}>Feed</h1>
                    <div className="header-buttons">
                        <div className="post-type-navigation">
                            <button
                                className={`post-type-btn ${location.search.includes('type=published') ? 'active' : ''}`}
                                onClick={() => {
                                    navigateToPostType('published');window.location.reload();}}>
                                Published Posts
                            </button>
                            <button
                                className={`post-type-btn ${location.search.includes('type=liked') ? 'active' : ''}`}
                                onClick={() => {
                                    navigateToPostType('liked');window.location.reload();}}>
                                Liked Posts
                            </button>
                            <button
                                className={`post-type-btn ${location.search.includes('type=disliked') ? 'active' : ''}`}
                                onClick={() => {
                                    navigateToPostType('disliked');window.location.reload();}}>
                                Disliked Posts
                            </button>
                        </div>
                        <button className="back-button" onClick={handleBackToAccount}>
                            Back to Account
                        </button>
                    </div>
                </div>
            </header>

            <div className="posts-content">
                <div className="posts-container">
                    <h2>{pageTitle}</h2>
                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                            <button onClick={() => window.location.reload()}>Try Again</button>
                        </div>
                    )}

                    {!loading && !error && postIds.length === 0 && (
                        <div className="no-posts-message">
                            <p>You don't have any {pageTitle.toLowerCase()} yet.</p>
                        </div>
                    )}

                    {!loading && !error && postIds.length > 0 && (
                        <div className="posts-list">
                            {postIds.map((post, index) => (
                                <div className="post-item" key={index}>
                                    <Link to={`/posts/${post.postId}`}>
                                        {post.title}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostTitles;
