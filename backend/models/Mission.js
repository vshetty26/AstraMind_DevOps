const mongoose = require("mongoose");

const MissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  planet: { type: String, required: true },
  status: { type: String, enum: ["Active", "Completed", "Failed", "Planned"], default: "Planned" },
  launchDate: { type: String },
  description: { type: String, default: "" },
  crew: { type: Number, default: 0 },
  duration: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Mission", MissionSchema);
