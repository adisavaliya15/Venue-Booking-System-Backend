const express = require('express');
const router = express.Router();
const connectDB = require('../../db/dbConnect');
const { ObjectId } = require('mongodb');

async function AddReview(req, res) {
    try {
        const db = await connectDB();
        const reviewsCollection = db.collection('reviews');
        
        //check session
        const sessionId = req.session.user;
        if (!sessionId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { userId, bookingId, venueId, rating, review } = req.body;

        //! Get current timestamp in IST
        const ISTOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        const dateIST = new Date(Date.now() + ISTOffset);

        const reviewExists = await reviewsCollection.findOne({ userId: ObjectId.createFromHexString(userId), bookingId: ObjectId.createFromHexString(bookingId) });

        if (reviewExists) {
            return res.status(400).json({ success: false, message: "Review already exists for this user and booking" });
        } else {
            const newReview = {
                userId: ObjectId.createFromHexString(userId),
                bookingId: ObjectId.createFromHexString(bookingId),
                venueId: ObjectId.createFromHexString(venueId),
                rating: parseFloat(rating),
                review,
                timestamp: dateIST
            };

            await reviewsCollection.insertOne(newReview);
            res.status(201).json({ success: true, message: "Review added successfully" });
        }
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ success: false, error: "Error adding review" });
    }
}

module.exports = { AddReview };
