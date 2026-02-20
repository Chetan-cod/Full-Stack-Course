import express from "express";
import {
  bookSeatController,
  getSeatsController,
  getSummaryController,
} from "./booking.controller.js";

const router = express.Router();

// Root API summary
router.get("/", getSummaryController);

// Book seat
router.post("/book/:seatId", bookSeatController);

// Get all seats
router.get("/seats", getSeatsController);

export default router;