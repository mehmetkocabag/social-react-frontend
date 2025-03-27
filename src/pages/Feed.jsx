import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import "./Feed.css";

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedPosts, setExpandedPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);
    const [comments, setComments] = useState([]);
    const commentInputRef = useRef(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("/api/v1/posts/feed");
                const sortedPosts = [...(response.data || [])].sort((a, b) => {
                    return new Date(b.timeStamp) - new Date(a.timeStamp);
                });
                setPosts(sortedPosts);
            } catch (err) {
                console.error("Error fetching posts", err);
                setError("Error fetching posts");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        console.log("User logged out");
        window.location.href = "/login";
    };

    const handleAccountClick = () => {
        window.location.href = '/account';
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        try {
            const response = await axios.get(`/api/v1/posts/search?query=${encodeURIComponent(searchQuery)}`
            );
            setPosts(response.data);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    const handleNewPost = () => {
        window.location.href = '/newpost';
    };

    const togglePostExpansion = (postId) => {
        setExpandedPosts(prev => {
            if (prev.includes(postId)) {
                return prev.filter(id => id !== postId);
            } else {
                return [...prev, postId];
            }
        });
    };

    const handleLike = async (postId) => {
        try {
            const currentUser = { userId: localStorage.getItem("userId") };
            const response = await axios.post(`/api/v1/posts/${postId}/like?userId=${currentUser.userId}`);

            setPosts(currentPosts =>
                currentPosts.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            likesCount: response.data.likesCount,
                            dislikesCount: response.data.dislikesCount
                        }
                        : post
                )
            );
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleDislike = async (postId) => {
        try {
            const currentUser = { userId: localStorage.getItem("userId") };
            const response = await axios.post(`/api/v1/posts/${postId}/dislike?userId=${currentUser.userId}`);

            setPosts(currentPosts =>
                currentPosts.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            likesCount: response.data.likesCount,
                            dislikesCount: response.data.dislikesCount
                        }
                        : post
                )
            );
        } catch (error) {
            console.error('Error disliking post:', error);
        }
    };

    const handleCommentClick = async (postId) => {
        try {
            if (activeCommentPostId === postId) {
                setActiveCommentPostId(null);
                return;
            }

            const response = await axios.get(`/api/v1/posts/${postId}/comments`);
            setComments(response.data || []);
            setActiveCommentPostId(postId);
        } catch (error) {
            console.error("Error loading comments", error);
        }
    };

    const handleCommentSubmit = async () => {
        const inputValue = commentInputRef.current.value.trim();
        if (!inputValue || !activeCommentPostId) return;

        try {
            const userId = localStorage.getItem("userId");

            await axios.post(
                `/api/v1/posts/${activeCommentPostId}/commentsAdd`,
                {
                    userId: userId,
                    content: inputValue
                }
            );
            const updatedCommentsResponse = await axios.get(
                `/api/v1/posts/${activeCommentPostId}/comments`
            );
            setComments(updatedCommentsResponse.data);

            setPosts(currentPosts =>
                currentPosts.map(post =>
                    post.id === activeCommentPostId
                        ? { ...post, commentsCount: updatedCommentsResponse.data.length }
                        : post
                )
            );

            commentInputRef.current.value = '';
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const CommentOverlay = () => {
        if (!activeCommentPostId) return null;

        return (
            <div className="comment-overlay">
                <div className="comment-container">
                    <div className="comment-header">
                        <h3>Comments</h3>
                        <button className="close-button" onClick={() => setActiveCommentPostId(null)}>×</button>
                    </div>


                    <div className="comments-list">
                        {comments.length === 0 ? (
                            <p className="no-comments">Be the first to comment!</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.commentId} className="comment">
                                    <strong>{comment.authorName}</strong>: {comment.content}
                                </div>

                            ))
                        )}
                    </div>
                    <div className="comment-input-container">
                        <input
                            type="text"
                            ref={commentInputRef}
                            className="comment-input"
                            placeholder="Add a comment..."
                        />
                        <button className="comment-input-button" onClick={handleCommentSubmit}>Post</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="page-container">
            <header className="app-header">
                <div className="header-content">

                    <h1 className="clickable-title" onClick={() => window.location.href = '/feed'}>Feed</h1>

                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button className="search-button" onClick={handleSearch}>
                            <span role="img" aria-label="search">🔍</span>
                        </button>
                    </div>

                    <div className="header-buttons">
                        <button
                            className="new-post-button"
                            onClick={handleNewPost}>
                            New Post
                        </button>
                        <button
                        className="account-button"
                        onClick={handleAccountClick}>
                        Account
                    </button>
                    <button
                        className="logout-button"
                        onClick={handleLogout}>
                        Logout
                    </button>
                    </div>
                </div>
            </header>

            <main className="feed-content">
                <div className="feed-container">
                    {loading && (
                        <div className="loading-spinner">
                            <p>Loading posts...</p>
                        </div>
                    )}
                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                            <button onClick={() => window.location.reload()}>
                                Try Again
                            </button>
                        </div>
                    )}
                    {!loading && !error && posts.length === 0 && (
                        <div className="no-posts-message">
                            <p>No posts available.</p>
                        </div>
                    )}
                    <div className="posts-container">
                        {posts.map((post) => (
                            <div className="post-card" key={post.id}>
                                <h2 className="post-title">{post.title}</h2>

                                <p className="post-author-byline">by {post.author?.username || "Anonymous"}</p>

                                {post.picture && (
                                    <img
                                        src={post.picture}
                                        alt={post.title}
                                        className="post-image"
                                    />
                                )}
                                <div className={`post-content ${expandedPosts.includes(post.id) ? 'expanded' : ''}`}>
                                    {post.content}
                                </div>

                                {post.content && post.content.length > 200 && (
                                    <button
                                        className="read-more-button"
                                        onClick={() => togglePostExpansion(post.id)}
                                    >
                                        {expandedPosts.includes(post.id) ? 'Show Less' : 'Read More'}
                                    </button>
                                )}

                                <div className="post-footer">
                                    <div className="post-actions">
                                        <button className="like-button"
                                                onClick={() => handleLike(post.id)}
                                        >
                                            <span>👍</span> {post.likesCount || 0}
                                        </button>
                                        <button className="dislike-button"
                                                onClick={() => handleDislike(post.id)}
                                        >
                                            <span>👎</span> {post.dislikesCount || 0}
                                        </button>
                                        <button
                                            className="action-button comment-button"
                                            onClick={() => handleCommentClick(post.id)}
                                        >
                                            <span role="img" aria-label="comment">🗯️</span>
                                            <span>{post.commentsCount || 0}</span>
                                        </button>
                                    </div>
                                    <span className="post-date">
                                        {post.creationDate || "Date unavailable"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <CommentOverlay/>
        </div>
    );
};

export default Feed;