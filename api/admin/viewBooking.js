const express = require("express");
const router = express.Router();
const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function ViewVenueBookings(req, res) {
  try {
    const db = await connectDB();
    const bookingsCollection = db.collection("bookings");

    const userId = req.userData.user.user;

    // if (!userId) {
    //     return res.status(401).json({ success: false, message: "Unauthorized User!" });
    // }

    // Fetch all bookings with user and venue details
    const allBookings = await bookingsCollection
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $lookup: {
            from: "venues",
            localField: "venueId",
            foreignField: "_id",
            as: "venue",
          },
        },
        {
          $unwind: "$venue",
        },
        {
          $sort: { fromDate: -1 }, // Sort by booking date in descending order
        },
        {
          $project: {
            userName: "$user.username" || "Unknown",
            venueName: "$venue.name",
            paymentAmount: 1,
            toDate: 1,
            fromDate: 1,
          },
        },
      ])
      .toArray();

    // const allBookings = await bookingsCollection.find({}).toArray();

    if (allBookings.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No bookings found" });
    } else {
      res.status(200).json({ success: true, bookings: allBookings });
    }
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res
      .status(500)
      .json({ success: false, error: "Error fetching all bookings" });
  }
}

module.exports = { ViewVenueBookings };
