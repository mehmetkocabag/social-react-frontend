import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed.jsx";
import NewPost from "./pages/NewPost.jsx";
import Account from "./pages/Account.jsx";
import PostTitles from "./pages/PostTitles.jsx";
import PostsByPostId from "./pages/PostsByPostId.jsx";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Feed" element={<Feed />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/newpost" element={<NewPost />} />
                <Route path="/account" element={<Account />} />
                <Route path="/posts/postTitles" element={<PostTitles />} />
                <Route path="/posts/:postId" element={<PostsByPostId />} />
            </Routes>
        </Router>
    );
};

export default App;