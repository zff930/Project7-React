//if user already read by display text for "if read"

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import Banner from "../components/Banner";
import "../styles/HomePage.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  //Fetch posts only if logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isLoggedIn, token]);

  // Called when PostForm successfully creates a post
  const handleNewPost = (newPost) => {
    if (!newPost) return;

    // Add new post at the top of the feed
    setPosts((prevPosts) => [newPost, ...prevPosts]);

    // Redirect to the new post page
    navigate(`/post/${newPost.id}`);
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

      {isLoggedIn ? (
        <>
          <PostForm onPostCreated={handleNewPost} />

          <div className="feed">
            <h3>Feed (Latest posts first)</h3>
            {loading ? (
              <p>Loading posts...</p>
            ) : Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="post-card">
                  <p>
                    <strong>
                      {post.author
                        ? `${post.author.firstName} ${post.author.lastName}`
                        : "Unknown User"}
                    </strong>
                  </p>
                  <p>{post.content}</p>
                  {post.media && <img src={post.media} alt="Post" />}
                  <small>{new Date(post.createdAt).toLocaleString()}</small>
                </div>
              ))
            ) : (
              <p>No posts yet</p>
            )}
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <p>Please log in or sign up to view posts and create content.</p>
        </div>
      )}
    </>
  );
}

export default Home;
