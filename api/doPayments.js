const express = require('express');
const router = express.Router();
const connectDB = require('../db/dbConnect');
const { ObjectId } = require('mongodb');

// Generate a random alphanumeric transaction ID
function generateTransactionId(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function DoPayment(req, res) {
    try {
        const db = await connectDB();
        const paymentsCollection = db.collection('payments');

        const { userId, owenerId, amount, paymentMethod } = req.body;

        // Assuming you generate the transaction ID here
        const transactionId = generateTransactionId(8);

        const payment = {
            userId: ObjectId.createFromHexString(userId),
            owenerId: ObjectId.createFromHexString(owenerId),
            amount: parseFloat(amount),
            paymentMethod,
            transactionId,
            status: "completed", // Assuming payment is immediately completed
            timestamp: new Date()
        };

        await paymentsCollection.insertOne(payment);
        res.status(201).json({ success: true, message: "Payment successful", paymentId: payment._id });
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({ success: false, error: "Error processing payment" });
    }
}

// Generate a random alphanumeric transaction ID
function generateTransactionId(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

module.exports = { DoPayment };