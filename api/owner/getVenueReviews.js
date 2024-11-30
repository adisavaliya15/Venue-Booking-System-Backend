const express = require('express');
const router = express.Router();
const connectDB = require('../../db/dbConnect');
const { ObjectId } = require('mongodb');

async function GetVenueReviews(req, res) {
    try {
        const db = await connectDB();
        const venuesCollection = db.collection('venues');
        const reviewsCollection = db.collection('reviews');
        
        //check session
        const userId = req.userData.user.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        // Get ownerId from the session
        const ownerId = req.userData.user.user._id;
        if (!ownerId) {
            return res.status(401).json({ success: false, message: "No ownerId found!" });
        }

        // Find venues owned by ownerId
        const ownedVenues = await venuesCollection.find({ ownerId: ObjectId.createFromHexString(ownerId) }).toArray();

        if (ownedVenues.length === 0) {
            return res.status(404).json({ success: false, message: "No venues found for this owner" });
        }

        // Extract venue IDs
        const venueIds = ownedVenues.map(venue => venue._id);

        // Find reviews for owned venues
        const venueReviews = await reviewsCollection.find({ venueId: { $in: venueIds } }).toArray();

        if (venueReviews.length === 0) {
            return res.status(404).json({ success: false, message: "No reviews found for venues owned by this owner" });
        } else {
            res.status(200).json({ success: true, reviews: venueReviews });
        }
    } catch (error) {
        console.error("Error fetching venue reviews:", error);
        res.status(500).json({ success: false, error: "Error fetching venue reviews" });
    }
}

module.exports = { GetVenueReviews };
