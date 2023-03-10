const { default: mongoose } = require("mongoose");
const mongo = require("mongoose");

const PostSchema = new mongoose.Schema({
  user: {
    type: mongo.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  video: {
    type: String,
  },
  like: {
    type: Array,
  },
  dislike: {
    type: Array,
  },
  comments: [
    {
      user: {
        type: mongo.Schema.ObjectId,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      profilepicture: {
        type: String,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdat: { type: Date, default: Date.now },
});

module.exports = mongo.model("Post", PostSchema);
