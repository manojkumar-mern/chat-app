import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

router.delete("/messages", async (req, res) => {
  await Message.deleteMany({});
  res.json({ success: true });
});


router.delete("/messages/:id", async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
