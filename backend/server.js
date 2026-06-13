const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Mission = require("./models/Mission");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "🚀 AstraMind API Running", status: "online" });
});

// GET all missions
app.get("/missions", async (req, res) => {
  try {
    const missions = await Mission.find().sort({ createdAt: -1 });
    res.json(missions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single mission
app.get("/missions/:id", async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ error: "Mission not found" });
    res.json(mission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create mission
app.post("/missions", async (req, res) => {
  try {
    const mission = new Mission(req.body);
    await mission.save();
    res.status(201).json(mission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update mission
app.put("/missions/:id", async (req, res) => {
  try {
    const mission = await Mission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mission) return res.status(404).json({ error: "Mission not found" });
    res.json(mission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE mission
app.delete("/missions/:id", async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id);
    if (!mission) return res.status(404).json({ error: "Mission not found" });
    res.json({ message: "Mission deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stats endpoint
app.get("/stats", async (req, res) => {
  try {
    const total = await Mission.countDocuments();
    const active = await Mission.countDocuments({ status: "Active" });
    const completed = await Mission.countDocuments({ status: "Completed" });
    const failed = await Mission.countDocuments({ status: "Failed" });
    const planned = await Mission.countDocuments({ status: "Planned" });
    res.json({ total, active, completed, failed, planned });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 AstraMind server running on http://localhost:${PORT}`);
});
