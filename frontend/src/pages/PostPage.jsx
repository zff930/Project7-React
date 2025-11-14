import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const PostPage = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch post");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched post:", data);
        setPost(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [id]);

  if (error) return <p className="error">Error: {error}</p>;
  if (!post) return <p>Loading post...</p>;

  return (
    <div className="post-page">
      <h2>
        Post #{post.id} by {post.author?.firstName} {post.author?.lastName}
      </h2>
      <p>{post.content}</p>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post" className="post-image" />
      )}
      <small>Posted on: {new Date(post.createdAt).toLocaleString()}</small>
    </div>
  );
};

export default PostPage;
