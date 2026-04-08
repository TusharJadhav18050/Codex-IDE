const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    languageId: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPublic: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Snippet", snippetSchema);
