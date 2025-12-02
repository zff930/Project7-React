const { User, Post } = require("../models");

// Create a post
exports.createPost = async (req, res, next) => {
  try {
    console.log("===== CREATE POST DEBUG =====");
    console.log("req.body:", req.body); // Check text content
    console.log("req.file:", req.file); // Check uploaded media
    console.log("=============================");

    const mediaUrl = req.file
      ? `${req.protocol}://${req.get("host")}/api/uploads/${req.file.filename}`
      : null;

    // Safely handle content
    let content = null;
    if (req.body.content) {
      if (typeof req.body.content === "string") {
        content = req.body.content.trim();
      } else if (req.body.content instanceof Object) {
        // If somehow an object got sent, stringify it
        content = JSON.stringify(req.body.content);
      } else {
        content = String(req.body.content);
      }
    }

    // Ensure at least content or media is provided
    if (!content && !mediaUrl) {
      return res.status(400).json({ error: "Post must have text or media." });
    }

    const post = await Post.create({
      userId: req.auth.userId,
      content: content || null,
      media: mediaUrl,
      readBy: [req.auth.userId],
    });

    // Fetch it again with author included
    const fullPost = await Post.findByPk(post.id, {
      include: {
        model: User,
        as: "author",
        attributes: ["id", "firstName", "lastName", "email"],
      },
    });

    res.status(201).json({ message: "Post created successfully!", post: fullPost });
  } catch (err) {
    console.error("Create post error:", err);
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

// Mark a post as read
exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const postId = req.params.id;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const readBy = Array.isArray(post.readBy) ? [...post.readBy] : [];

    if (!readBy.includes(userId)) {
      readBy.push(userId);
      post.readBy = readBy;
      await post.save();
    }

    res.status(200).json({
      message: "Post marked as read successfully.",
      post,
    });
  } catch (err) {
    console.error("Mark as read error:", err);
    res.status(500).json({ error: "Failed to mark post as read." });
  }
};
