const { User, Post } = require("../models");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  Post.create({
    userId: req.auth.userId,
    content: req.body.content,
    imageUrl: req.file ? `${url}/images/${req.file.filename}` : null,
    likesCount: 0,
    commentsCount: 0,
  })
    .then((post) => res.status(201).json({ message: "Post created successfully!", post }))
    .catch((err) => res.status(400).json({ error: err }));
};

// GET all posts
exports.getAllPosts = (req, res, next) => {
  Post.findAll({
    include: {
      model: User,
      as: 'author',
      attributes: ['id', 'firstName', 'lastName', 'email'],
    },
    order: [['createdAt', 'DESC']],
  })
    .then((posts) => res.status(200).json(posts))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve posts' });
    });
};
