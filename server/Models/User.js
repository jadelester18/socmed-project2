const { default: mongoose } = require("mongoose")
const mongo = require("mongoose")
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: {
    type: Array,
  },
  following: {
    type: Array,
  },
  phonenumber: {
    type: Number,
    required: true,
  },
  profilepicture: {
    type: String,
  },
});

module.exports = mongo.model("User", UserSchema)