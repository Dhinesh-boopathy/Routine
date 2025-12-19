import { Router } from "express";
import mongoose from "mongoose";

import RoutineTemplate from "../models/RoutineTemplate.js";

const router = Router();

/**
 * Seed system default routine (runs only once)
 * TEMP route – can be removed later
 */
router.post("/seed-default", async (req, res) => {
  try {
    const exists = await RoutineTemplate.findOne({ userId: null });

    if (exists) {
      return res.status(200).json({
        message: "Default routine already exists",
      });
    }

    const routine = await RoutineTemplate.create({
      userId: null,
      title: "System Default Routine",
      tasks: [
        { title: "Wake up early", description: "Before 7:00 AM" },
        { title: "Study / Learn 30 minutes", description: "Skill or reading" },
        { title: "Avoid unnecessary spending", description: "No impulse purchases" },
        { title: "Exercise or walk", description: "15–30 mins for health" },
        { title: "Save a small amount", description: "Even ₹10 counts" },
        { title: "Reflect for 5 minutes", description: "Think about your day" },
      ],
    });

    res.status(201).json({
      message: "System default routine seeded",
      routine,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/active", async (req, res) => {
  try {
    const { userId } = req.query;
    let routine = null;

    // ✅ Only query user routine if ObjectId is valid
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      routine = await RoutineTemplate.findOne({
        userId,
        isActive: true,
      });
    }

    // 🔁 Fallback to system default
    if (!routine) {
      routine = await RoutineTemplate.findOne({
        userId: null,
        isActive: true,
      });
    }

    if (!routine) {
      return res.status(404).json({
        message: "No routine found",
      });
    }

    res.status(200).json(routine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
