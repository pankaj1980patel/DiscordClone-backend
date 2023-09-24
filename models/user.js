const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
  mail: { type: String, unique: true },
  friends:[{type:mongoose.Schema.Types.Mixed, ref: 'User' }]
});

module.exports = mongoose.model("User", userSchema);
