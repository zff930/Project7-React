import { API_BASE_URL } from "../config";
import { useEffect, useState } from "react";
import "../styles/Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");

      try {
        // Send request to backend and backend sends res to frontend
        const res = await fetch(`${API_BASE_URL}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        
        // Parse res sent from backend to JS object/array
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div className="feed">
      <h2>Feed (Latest posts first)</h2>
      {posts.length === 0 || posts === null ? (
        <p>No posts yet</p>
      ) : (
        posts?.map((post) => (
          <div key={post.id} className="post-card"> {/* key needed when rendering a list of elements to update specific elements in the DOM */}
            <div className="post-header">
              <strong>{post.author?.firstName || "Unknown User"}</strong> ·{" "}
              {new Date(post.createdAt).toLocaleString()}
            </div>
            <p>{post.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;
