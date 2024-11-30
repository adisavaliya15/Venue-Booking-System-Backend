const express = require('express');
const router = express.Router();
const connectDB = require('../../db/dbConnect');
const { ObjectId } = require('mongodb');

async function GetAllReviews(req, res) {
    try {
        const db = await connectDB();
        const reviewsCollection = db.collection('reviews');

        const userId = req.userData.user.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        // Fetch all reviews
        const allReviews = await reviewsCollection.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $project: {
                    userName: { $concat: ['$user.fName', ' ', '$user.lName'] },
                    venueId: 1,
                    rating: 1,
                    review: 1,
                    timestamp: 1
                }
            }
        ]).toArray();


        if (allReviews.length === 0) {
            return res.status(404).json({ success: false, message: "No reviews found" });
        } else {
            res.status(200).json({ success: true, reviews: allReviews });
        }
    } catch (error) {
        console.error("Error fetching all reviews:", error);
        res.status(500).json({ success: false, error: "Error fetching all reviews" });
    }
}

module.exports = { GetAllReviews };
