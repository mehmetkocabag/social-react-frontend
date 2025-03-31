import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NewPost.css";

const NewPost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Please fill title.");
            return;
        }

        setIsSubmitting(true);
        try {
            const userId = localStorage.getItem("userId");

            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("title", title);
            formData.append("content", content);

            if (image) {
                formData.append("file", image);
            }

            await axios.post("/api/v1/posts/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            navigate("/feed");
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/feed");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="page-container">
            <div className="new-post-container">
                <h2>Create a New Post</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Post title..."
                            required
                            className="post-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Content..."
                            className="post-input content-textarea"
                            rows={8}
                        />
                        <div className="image-upload-container">
                            <label htmlFor="image-upload" className="image-upload-button">
                                🔗  Attach Image
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                    {imagePreview && (
                        <div className="image-preview-container">
                            <img src={imagePreview} alt="Preview" className="image-preview" />
                            <button
                                type="button"
                                className="remove-image-button"
                                onClick={() => {
                                    setImage(null);
                                    setImagePreview(null);
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    <div className="button-group">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="post-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Posting..." : "Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewPost;