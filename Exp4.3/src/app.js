import express from "express";
import bookingRoutes from "./modules/booking/booking.route.js";

const app = express();

app.use(express.json());

// Pretty JSON
app.set("json spaces", 2);

// ✅ ROOT PAGE (Homepage)
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Redis Booking API</title>
        <style>
          body {
            font-family: Arial;
            background: #0f172a;
            color: white;
            padding: 40px;
          }
          a {
            color: #38bdf8;
            text-decoration: none;
            display: block;
            margin: 10px 0;
            font-size: 18px;
          }
          h1 {
            color: #22d3ee;
          }
        </style>
      </head>
      <body>
        <h1>🎟 Redis Booking API is Running!</h1>
        <h3>Available Endpoints:</h3>
        <a href="/api">GET /api → View Seat Summary</a>
        <a href="/api/seats">GET /api/seats → View All Seats</a>
        <a href="/api/book/1">POST /api/book/1 → Book Seat 1 (Use Postman)</a>
      </body>
    </html>
  `);
});

// API Routes
app.use("/api", bookingRoutes);

export default app;