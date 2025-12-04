import { useState, useEffect } from "react";
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
  const userId = localStorage.getItem("userId");
  const isLoggedIn = !!token;

  // Helper function to show only the first 10 words
  const truncateText = (text, wordLimit = 10) => {
    if (!text) return "";
    // regex - match one or more consecutive whitespace characters.
    const words = text.trim().split(/\s+/);
    // slice - array method that returns a portion (a shallow copy) of an array
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

    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isLoggedIn, token]);

  // Called when PostForm successfully creates a post
  // data.post from PostForm is assigned to newPost
  const handleNewPost = (newPost) => {
    if (!newPost) return;

    // Mark as read for creator
    const updatedPost = {
      ...newPost,
      readBy: [userId],
    };

    // Add new post at the top of the feed but filter out duplicate ones with same id
    setPosts((prevPosts) => {
      const filtered = prevPosts.filter((p) => p.id !== newPost.id);
      return [updatedPost, ...filtered];
    });
  };

  // Check if post has been read by the user
  const isPostRead = (post) => {
    if (!post.readBy || !Array.isArray(post.readBy)) return false;
    return post.readBy.includes(userId);
  };

  // Navigate to post page and mark as read
  const handleClickPost = async (postId) => {
    try {
      await fetch(`${API_BASE_URL}/posts/${postId}/markAsRead`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Optimistic update - mark read both on the server (via fetch) and immediately in the UI, before waiting for the server response
      //                   - make the app feel faster and more responsive
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                readBy: post.readBy
                  ? [...new Set([...post.readBy, userId])]
                  : [userId],
              }
            : post
        )
      );

      navigate(`/post/${postId}`);
    } catch (err) {
      console.error("Error marking post as read:", err);
      navigate(`/post/${postId}`);
    }
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
                ) : posts.length ? (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className={`post-card ${
                        isPostRead(post) ? "read" : "unread"
                      }`}
                      onClick={() => handleClickPost(post.id)}
                    >
                      <p>
                        <strong>
                          {post.author
                            ? `${post.author.firstName} ${post.author.lastName}`
                            : "Unknown User"}
                        </strong>
                        {isPostRead(post) && (
                          <span className="read-label">• Read</span>
                        )}
                      </p>

                      <p>
                        {truncateText(post.content, 10)}{" "}
                        {post.content &&
                          post.content.trim().split(/\s+/).length > 10 && (
                            <span
                              className="read-more"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClickPost(post.id);
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
