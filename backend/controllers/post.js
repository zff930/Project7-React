const { User, Post } = require("../models");

exports.createPost = async (req, res, next) => {
  try {
    const url = req.protocol + "://" + req.get("host");

    const post = await Post.create({
      userId: req.auth.userId,
      content: req.body.content,
      imageUrl: req.file ? `${url}/images/${req.file.filename}` : null,
      likesCount: 0,
      commentsCount: 0,
    });

    res.status(201).json({ message: "Post created successfully!", post });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

// GET all posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        as: "author",
        attributes: ["id", "firstName", "lastName", "email"],
      },
      order: [["createdAt", "DESC"]],
    });
    
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
};
