const express = require('express');
const router = express.Router();
const connectDB = require('../../db/dbConnect');
const { ObjectId } = require('mongodb');

async function SubmitComplaint(req, res) {
    try {
        const db = await connectDB();
        const complaintsCollection = db.collection('complaints');


        //check session
        const sessionId = req.session.user;
        if (!sessionId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { userId, bookingId, venueId, ownerId, complaintDetail } = req.body;

        const complaintExists = await complaintsCollection.findOne({ userId: ObjectId.createFromHexString(userId), bookingId: ObjectId.createFromHexString(bookingId) });

        //! Get current timestamp in IST
        const ISTOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        const dateIST = new Date(Date.now() + ISTOffset);

        if (complaintExists) {
            return res.status(400).json({ success: false, message: "Complaint already exists for this user and booking" });
        } else {
            // Create a new complaint object
            const newComplaint = {
                userId: ObjectId.createFromHexString(userId),
                bookingId: ObjectId.createFromHexString(bookingId),
                venueId: ObjectId.createFromHexString(venueId),
                ownerId: ObjectId.createFromHexString(ownerId),
                complaintDetail,
                timestamp: dateIST
            };

            // Insert the new complaint into the database
            await complaintsCollection.insertOne(newComplaint);

            res.status(201).json({ success: true, message: "Complaint submitted successfully" });
        }
    } catch (error) {
        console.error("Error submitting complaint:", error);
        res.status(500).json({ success: false, error: "Error submitting complaint" });
    }
}

module.exports = { SubmitComplaint };
