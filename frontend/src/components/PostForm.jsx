// src/components/PostForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PostForm.css";

const PostForm = ({ onPostSubmit }) => {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Simulate backend call
    const newPost = {
      id: Date.now(),
      user: { username: "CurrentUser" },
      content,
      createdAt: new Date().toISOString(),
    };

    // Pass new post content up to parent
    onPostSubmit(content);
    setContent("");

    navigate(`/post/${newPost.id}`);
  };

  return (
    <div className="post-form">
      <h3>Create New Post</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Your status..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default PostForm;
