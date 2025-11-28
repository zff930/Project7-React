//if user already read by display text for "if read"

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import PostForm from "../components/PostForm";
import Banner from "../components/Banner";
import "../styles/HomePage.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // Helper function to show only the first 10 words
  const truncateText = (text, wordLimit = 10) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

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

    // Add new post at the top of the feed but filter out duplicate ones with same id
    setPosts((prevPosts) => {
      const filtered = prevPosts.filter((p) => p.id !== newPost.id);
      return [newPost, ...filtered];
    });

    // Redirect to the new post page
    navigate(`/post/${newPost.id}`);
  };

  // Navigate to post page and mark as read
  const handleClickPost = async (postId) => {
    try {
      // Optional: send a "mark as read" request to backend
      await fetch(`${API_BASE_URL}/posts/${postId}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error marking post as read:", err);
    }

    navigate(`/post/${postId}`);
  };

  // Check if post has been read by the user
  const isPostRead = (post) => {
    if (!post.readBy) return false;
    const userId = localStorage.getItem("userId");
    return post.readBy.includes(userId);
  };

  return (
    <>
      <Banner />
      <div className="home-wrapper">
        <section className="welcome-message">
          <h2 className="welcome">Welcome to GroupomaniaConnect</h2>
          <p className="description">
            Share updates, ideas, and moments with your colleagues.
          </p>
        </section>

        <div className="content-wrapper">
          {isLoggedIn ? (
            <>
              <div className="post-form-wrapper">
                <PostForm onPostCreated={handleNewPost} />
              </div>

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
                        {isPostRead && <span className="read-label">• Read</span>}
                      </p>

                      {/* Truncated content with “Read more” link */}
                      <p>
                        {truncateText(post.content, 10)}{" "}
                        {post.content &&
                          post.content.trim().split(/\s+/).length > 10 && (
                            <span
                              className="read-more"
                              onClick={(e) => {
                                e.stopPropagation(); // prevent triggering parent click twice
                                handleClickPost();
                              }}
                            >
                              Read more
                            </span>
                          )}
                      </p>

                      {post.media &&
                        (post.media.endsWith(".mp4") ? (
                          <div className="video-container">
                            <video
                              src={post.media}
                              controls
                              className="post-media video"
                            />
                          </div>
                        ) : post.media.endsWith(".mp3") ? (
                          <audio
                            src={post.media}
                            controls
                            className="post-media audio"
                          />
                        ) : (
                          <img
                            src={post.media}
                            alt="Post"
                            className="post-media img"
                          />
                        ))}
                      <small>{new Date(post.createdAt).toLocaleString()}</small>
                    </div>
                  ))
                ) : (
                  <p>No posts yet</p>
                )}
              </div>
            </>
          ) : (
            <div className="login-message">
              <p>Please log in or sign up to view posts and create content.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
