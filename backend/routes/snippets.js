const express = require("express");
const Snippet = require("../models/Snippet");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @GET /api/snippets - Get logged-in user's snippets
router.get("/", protect, async (req, res) => {
  try {
    const snippets = await Snippet.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/snippets - Save a snippet
router.post("/", protect, async (req, res) => {
  try {
    const { title, code, language, languageId, isPublic, tags } = req.body;
    const snippet = await Snippet.create({
      title, code, language, languageId,
      user: req.user._id,
      isPublic: isPublic || false,
      tags: tags || [],
    });
    res.status(201).json(snippet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/snippets/:id - Update a snippet
router.put("/:id", protect, async (req, res) => {
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id, user: req.user._id });
    if (!snippet) return res.status(404).json({ message: "Snippet not found" });

    const updated = await Snippet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/snippets/:id - Delete a snippet
router.delete("/:id", protect, async (req, res) => {
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id, user: req.user._id });
    if (!snippet) return res.status(404).json({ message: "Snippet not found" });

    await snippet.deleteOne();
    res.json({ message: "Snippet deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/snippets/public - Get all public snippets
router.get("/public", async (req, res) => {
  try {
    const snippets = await Snippet.find({ isPublic: true })
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
