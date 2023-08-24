const Comment = require("../models/commentModel");
const { ErrorHandler } = require("../middleware/ErrorHandler");

const addComment = async (req, res, next) => {
  try {
    const { postid, comment_text } = req.body;
    const user = req.user;
    const userid = user._id;

    if (!user) {
      return next(new ErrorHandler(400, "Login or signup to continue"));
    }

    if (!postid) {
      return next(new ErrorHandler(400, "No post found"));
    }
    if (!comment_text) {
      return next(new ErrorHandler(400, "Enter something to comment"));
    }

    const comment = new Comment({
      user: userid,
      comment_text: comment_text,
      post: postid,
    });

    await comment.save();

    console.log(comment);

    return res.status(200).json({
      comment,
      success: true,
      msg: "commented on post",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  addComment,
};
