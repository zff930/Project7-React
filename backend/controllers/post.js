const { Post, User } = require("../models");

// Create a post
Post.create({
  userId: "b37f8c92-2f7c-4f77-b48d-456de2e31456",
  content: "This is my first post!",
})
  .then((newPost) => {
    console.log("Post created:", newPost.id);

    // Fetch all posts with authors
    return Post.findAll({
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "email"],
        },
      ],
    });
  })
  .then((posts) => {
    // Convert Sequelize instances to plain objects for easier logging
    console.log(posts.map((post) => post.toJSON()));
  })
  .catch((err) => {
    console.error("Error:", err);
  });