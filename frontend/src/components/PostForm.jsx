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

    // Even though the user just selected a file, it’s possible for files[0] to be undefined.
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    } else {
      setPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content && !media) {
      alert("Please enter text or upload media.");
      return;
    }

    const formData = new FormData();
    if (content.trim()) formData.append("content", content.trim());
    if (media) formData.append("media", media);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // no JSON headers → browser sets request header 'Content-Type: multipart/form-data' automatically
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      // returns { message: "...", post: ... }
      const data = await res.json();
      // callback function
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
      <div className="form-group">
        <label htmlFor="post-content" className="form-label">
          Post Content
        </label>
        <textarea
          id="post-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="post-input"
          placeholder="Write something..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="post-media" className="form-label">
          Upload Media (Image, Audio, Video)
        </label>
        <input
          id="post-media"
          type="file"
          name="media"
          accept="image/png, image/jpeg, image/jpg, audio/mpeg, video/mp4"
          onChange={handleMediaChange}
          className="file-input"
        />
      </div>
      
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
            <audio controls src={preview}></audio> /*controls as boolean attribute set to true by default to interact with audios*/
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
