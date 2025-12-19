import { Router } from "express";
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

export default router;
