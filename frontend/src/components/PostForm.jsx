import { useState } from "react";
import { API_BASE_URL } from "../config";
import "../styles/PostForm.css";

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState("");

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    } else {
      setPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !media) {
      alert("Please enter text or upload media.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    if (media) formData.append("media", media);

    try {
      const res = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // no JSON headers → browser sets multipart automatically
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      const data = await res.json();
      onPostCreated(data.post);

      // reset form
      setContent("");
      setMedia(null);
      setPreview("");
    } catch (error) {
      console.error("Post creation error:", error.message);
      alert("Failed to create post: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="post-input"
        placeholder="Write something..."
      />

      <input
        type="file"
        accept="image/png, image/jpeg, audio/mpeg, video/mp4"
        onChange={handleMediaChange}
        className="file-input"
      />

      {/* Preview area */}
      {preview && (
        <div className="media-preview">
          {media.type.startsWith("image") && (
            <img
              src={preview}
              alt="preview"
              style={{ maxWidth: "200px", borderRadius: "8px" }}
            />
          )}

          {media.type.startsWith("audio") && (
            <audio controls src={preview}></audio>
          )}

          {media.type.startsWith("video") && (
            <video controls width="250" src={preview}></video>
          )}
        </div>
      )}

      <button type="submit" className="submit-btn">
        Post
      </button>
    </form>
  );
};

export default PostForm;
