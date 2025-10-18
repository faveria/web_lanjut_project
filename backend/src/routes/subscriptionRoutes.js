const express = require('express');
const { createInvoice, handlePaymentWebhook, getSubscriptionStatus } = require('../controllers/subscriptionController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create subscription invoice
router.post('/create-invoice', authenticateToken, createInvoice);

// Get subscription status
router.get('/status', authenticateToken, getSubscriptionStatus);

// Xendit webhook handler (no authentication required as Xendit will call this)
router.post('/webhook', handlePaymentWebhook);

module.exports = router;