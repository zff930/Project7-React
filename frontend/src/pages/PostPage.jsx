import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Banner from "../components/Banner";
import { API_BASE_URL } from "../config";

// Reusable component for rendering media
const MediaRenderer = ({ src }) => {
  if (!src) return null;

  // If src is just a filename, prepend backend URL
  const url = src.startsWith("http")
    ? src
    : `${API_BASE_URL.replace("/api", "")}/${src}`;

  if (url.endsWith(".mp4"))
    return (
      <video src={url} controls className="post-media video">
        Your browser does not support video playback.
      </video>
    );

  if (url.endsWith(".mp3"))
    return (
      <audio src={url} controls className="post-media audio">
        Your browser does not support audio playback.
      </audio>
    );

  return <img src={url} alt="Post" className="post-media img" />;
};

const PostPage = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Post not found");
          } else {
            throw new Error(`Error ${res.status}`);
          }
        }

        const data = res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p>Loading post...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!post) return <p>Loading post...</p>;

  return (
    <>
      <Banner />
      <div className="post-page">
        <h2>
          Post #{post.id} by {post.author?.firstName} {post.author?.lastName}
        </h2>

        <p>{post.content}</p>

        <MediaRenderer src={post.media} />

        <small>Posted on: {new Date(post.createdAt).toLocaleString()}</small>
      </div>
    </>
  );
};

export default PostPage;
