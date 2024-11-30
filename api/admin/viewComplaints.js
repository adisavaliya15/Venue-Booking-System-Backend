const express = require("express");
const router = express.Router();
const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function GetAllComplaints(req, res) {
  try {
    const db = await connectDB();
    const complaintsCollection = db.collection("complaints");

    //check session
    const userId = req.userData.user.user;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized User!" });
    }

    // Fetch all complaints
    const allComplaints = await complaintsCollection
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
          $sort: { timestamp: -1 },
        },
        {
          $project: {
            userName: { $concat: ["$user.fName", " ", "$user.lName"] },
            bookingId: 1,
            venueId: 1,
            ownerId: 1,
            complaintDetail: 1,
            timestamp: 1,
          },
        },
      ])
      .toArray();

    if (allComplaints.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No complaints found" });
    } else {
      res
        .status(200)
        .json({
          complaints: allComplaints,
          success: true,
          message: "Complaints fetched successfully",
        });
    }
  } catch (error) {
    console.error("Error fetching all complaints:", error);
    res
      .status(500)
      .json({ success: false, error: "Error fetching all complaints" });
  }
}

module.exports = { GetAllComplaints };
