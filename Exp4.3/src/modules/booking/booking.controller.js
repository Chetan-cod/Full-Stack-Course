import { bookSeatService } from "./booking.service.js";
import { getAllSeats, getSeatSummary } from "./booking.model.js";

export const bookSeatController = async (req, res) => {
  const { seatId } = req.params;

  const result = await bookSeatService(seatId);

  res.status(result.status).json({
    message: result.message,
  });
};

export const getSeatsController = (req, res) => {
  res.json({
    seats: getAllSeats(),
  });
};

// ✅ ADD THIS
export const getSummaryController = (req, res) => {
  res.json({
    summary: getSeatSummary(),
  });
};