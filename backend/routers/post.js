const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require('../middleware/multer-config');

const postCtrl = require("../controllers/post");

// For every request coming to this endpoint, use the corresponding function on our post controller.
// Add auth middleware and multer before controller.
router.post("/", auth, multer, postCtrl.createPost);
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getPostById);

// router.put("/:id", auth, multer, saucesCtrl.updateOneSauce);
// router.delete("/:id", auth, saucesCtrl.deleteOneSauce);

module.exports = router;
