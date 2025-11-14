const { User, Post } = require("../models");

// Create a post
exports.createPost = async (req, res, next) => {
  try {
    // const url = req.protocol + "://" + req.get("host");
    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const post = await Post.create({
      userId: req.auth.userId,
      content: req.body.content,
      media: mediaUrl,
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

// Get a post
exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: {
        model: User,
        as: "author",
        attributes: ["id", "firstName", "lastName", "email"],
      },
    });

    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve the post" });
  }
};
