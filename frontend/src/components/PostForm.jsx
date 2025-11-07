import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PostForm.css";

const PostForm = ({ onPostSubmit }) => {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await onPostSubmit(content);
      setContent("");
    } catch (err) {
      console.error(err);
    }
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
