import {
  getSeatStatus,
  setSeatBooked,
  seatExists,
} from "./booking.model.js";

import {
  acquireLock,
  releaseLock,
} from "../../utils/lock.util.js";

export const bookSeatService = async (seatId) => {
  const lockKey = `lock:seat:${seatId}`;

  const token = await acquireLock(lockKey);

  if (!token) {
    return { status: 423, message: "Seat is locked. Try again." };
  }

  try {
    if (!seatExists(seatId)) {
      return { status: 404, message: "Seat not found." };
    }

    const status = getSeatStatus(seatId);

    if (status === "booked") {
      return { status: 400, message: "Seat already booked." };
    }

    setSeatBooked(seatId);

    return { status: 200, message: "Seat booked successfully." };
  } finally {
    await releaseLock(lockKey, token);
  }
};