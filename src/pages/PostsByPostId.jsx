import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./PostsByPostId.css";

const PostsByPostId = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/v1/posts/id/${postId}`);
                setPost(response.data);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError("Failed to load post. Please try again later.");
            }
        };

        fetchPost();
    }, [postId]);

    if (error) return (
        <div className="error-container">
            <div className="error">Error</div>
            <p>{error}</p>
        </div>
    );

    if (!post) return (
        <div className="not-found-container">
            <h2>Post Not Found</h2>
            <p>The post you're looking for doesn't exist or has been removed.</p>
        </div>
    );

    return (
        <div className="post-detail-container">
            <header className="app-header">
                <div className="header-content">
                    <h1 className="clickable-title" onClick={() => window.location.href = '/feed'}>Feed</h1>
                    <div className="header-buttons">
                        <button onClick={() => window.history.back()} className="back-button">
                            Back
                        </button>
                    </div>
                </div>
            </header>

            <div className="post-detail-container">
                <article className="post-card">
                    <header className="post-header">
                        <h1 className="post-title">{post.title}</h1>
                    </header>

                    {post.picture && (
                        <div className="post-image-container">
                            <img src={`/api/v1/images/${post.picture}`} alt={post.title} className="post-image" />
                        </div>
                    )}

                    <div className="post-content">
                        {post.content.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>

                    <footer className="post-footer">
                        <div className="post-actions">
                            <div className="action-button like-button">
                                <span className="action-icon">👍</span>
                                <span className="action-count">{post.likesCount}</span>
                            </div>
                            <div className="action-button dislike-button">
                                <span className="action-icon">👎</span>
                                <span className="action-count">{post.dislikesCount}</span>
                            </div>
                            <div className="action-button comment-button">
                                <span className="action-icon">🗯️</span>
                                <span className="action-count">{post.commentsCount}</span>
                            </div>
                        </div>
                        <div className="post-metadata">
                            <span className="author-username">{post.author.username}</span>
                            <span className="post-date">{post.creationDate}</span>
                        </div>

                    </footer>
                </article>
            </div>
        </div>
    );
};

export default PostsByPostId;