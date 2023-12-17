const mongoose = require("mongoose");
const { Schema } = mongoose;

const tokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  tokenExpiresAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("tokens", tokenSchema);
