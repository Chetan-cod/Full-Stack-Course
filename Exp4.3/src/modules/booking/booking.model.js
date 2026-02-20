const seats = {
  "1": "available",
  "2": "available",
  "3": "available",
  "4": "available",
  "5": "available",
};

export const getSeatStatus = (seatId) => seats[seatId];

export const setSeatBooked = (seatId) => {
  seats[seatId] = "booked";
};

export const seatExists = (seatId) => {
  return seats.hasOwnProperty(seatId);
};

export const getAllSeats = () => seats;

// ✅ ADD THIS FUNCTION
export const getSeatSummary = () => {
  const total = Object.keys(seats).length;

  const booked = Object.values(seats).filter(
    (seat) => seat === "booked"
  ).length;

  const available = total - booked;

  return { total, booked, available };
};