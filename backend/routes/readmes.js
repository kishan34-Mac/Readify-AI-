const express = require("express");
const Readme = require("../models/Readme");
const { requireAuth } = require("../middleware/auth");
const { requireDbReady } = require("../middleware/dbReady");

const router = express.Router();

router.get("/", requireDbReady, requireAuth, async (req, res) => {
  try {
    const readmes = await Readme.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .select("_id title sourceType sourceLabel content createdAt updatedAt");

    res.json({
      readmes: readmes.map((item) => ({
        id: String(item._id),
        title: item.title,
        sourceType: item.sourceType,
        sourceLabel: item.sourceLabel,
        content: item.content,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Listing readmes failed:", error);
    res.status(500).json({ error: "Could not load saved README files." });
  }
});

router.post("/", requireDbReady, requireAuth, async (req, res) => {
  try {
    const { title = "", sourceType = "folder", sourceLabel = "", content = "" } = req.body || {};

    if (!title.trim()) {
      return res.status(400).json({ error: "Title is required." });
    }

    if (!content.trim()) {
      return res.status(400).json({ error: "README content is required." });
    }

    const readme = await Readme.create({
      user: req.user._id,
      title: title.trim(),
      sourceType,
      sourceLabel: sourceLabel.trim() || title.trim(),
      content,
    });

    res.status(201).json({
      readme: {
        id: String(readme._id),
        title: readme.title,
        sourceType: readme.sourceType,
        sourceLabel: readme.sourceLabel,
        content: readme.content,
        createdAt: readme.createdAt,
        updatedAt: readme.updatedAt,
      },
    });
  } catch (error) {
    console.error("Saving readme failed:", error);
    res.status(500).json({ error: "Could not save the README." });
  }
});

router.patch("/:id", requireDbReady, requireAuth, async (req, res) => {
  try {
    const { title = "", content = "" } = req.body || {};

    const readme = await Readme.findOne({ _id: req.params.id, user: req.user._id });
    if (!readme) {
      return res.status(404).json({ error: "README not found." });
    }

    if (title.trim()) {
      readme.title = title.trim();
    }

    if (content.trim()) {
      readme.content = content;
    }

    await readme.save();

    res.json({
      readme: {
        id: String(readme._id),
        title: readme.title,
        sourceType: readme.sourceType,
        sourceLabel: readme.sourceLabel,
        content: readme.content,
        createdAt: readme.createdAt,
        updatedAt: readme.updatedAt,
      },
    });
  } catch (error) {
    console.error("Updating readme failed:", error);
    res.status(500).json({ error: "Could not update the README." });
  }
});

module.exports = router;
