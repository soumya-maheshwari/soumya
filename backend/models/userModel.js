const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
    },
    no_of_posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        // default: 0,
      },
    ],

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: 0,
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: 0,
      },
    ],
  }

  // { timestamps: true }
);

// const UserModel = mongoose.model("user", userSchema);

// module.exports = UserModel;

module.exports = mongoose.model("User", userSchema);
