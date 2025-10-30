// display all posts, desc by timestamp, PostForm
// if user already read by display text for "if read"

import React, { useState, useEffect } from "react";
import PostForm from "../components/PostForm";
import Banner from "../components/Banner";
import "../styles/HomePage.css";

function Home() {
  const [posts, setPosts] = useState([]);

  // Example: Fetch posts from backend
  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(console.error);
  }, []);

  const handleNewPost = (newContent) => {
    const newPost = {
      id: Date.now(),
      user: { username: "CurrentUser" },
      content: newContent,
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]); // show new post on top
  };

  return (
    <>
      <Banner />
      <div className="welcome-message">
        <h1 className="welcome">Welcome to GroupomaniaConnect</h1>
        <h2 className="description">
          Share updates, ideas, and moments with your colleagues.
        </h2>
      </div>

      <PostForm onPostSubmit={handleNewPost} />
      <div className="feed">
        <h3>Feed (Latest posts first)</h3>
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <p>
              <strong>{post.user.username}</strong>
            </p>
            <p>{post.content}</p>
            <small>{new Date(post.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
