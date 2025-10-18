const { Xendit } = require('xendit-node');
const { User } = require('../models');
require('dotenv').config();

const xenditInstance = new Xendit({
  apiKey: process.env.XENDIT_API_KEY,
});

const invoiceSpecificOptions = xenditInstance.Invoice;

// Define subscription plans
const subscriptionPlans = {
  monthly: {
    id: 'monthly',
    name: '1 Month Plan',
    amount: 29000,
    description: '1 Month Premium Subscription Plan',
    validityDays: 30
  },
  quarterly: {
    id: 'quarterly',
    name: '3 Months Plan',
    amount: 69000,
    description: '3 Months Premium Subscription Plan',
    validityDays: 90
  },
  annual: {
    id: 'annual',
    name: '1 Year Plan',
    amount: 259000,
    description: '1 Year Premium Subscription Plan',
    validityDays: 365
  }
};

const createInvoice = async (req, res) => {
  try {
    const { planId } = req.body;
    const { user } = req;

    // Validate plan ID
    if (!subscriptionPlans[planId]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan'
      });
    }

    const plan = subscriptionPlans[planId];

    // Create the invoice using Xendit
    const createdInvoice = await invoiceSpecificOptions.createInvoice({
      externalID: `invoice_${user.id}_${Date.now()}`,
      amount: plan.amount,
      description: plan.description,
      payerEmail: user.email,
      shouldSendEmail: false, // We'll handle email notifications ourselves
    });

    res.status(200).json({
      success: true,
      message: 'Invoice created successfully',
      data: {
        invoiceUrl: createdInvoice.invoiceUrl,
        invoiceId: createdInvoice.id,
        amount: createdInvoice.amount,
        expiryDate: createdInvoice.expiryDate
      }
    });

  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice',
      error: error.message
    });
  }
};

// Webhook endpoint to handle Xendit payment notifications
const handlePaymentWebhook = async (req, res) => {
  try {
    const { event_type, data } = req.body;

    if (event_type === 'invoice.paid') {
      const invoice = data;
      const userId = invoice.external_id.split('_')[1]; // Extract user ID from external_id

      // Find the user
      const user = await User.findByPk(userId);
      if (!user) {
        console.error('User not found for invoice:', invoice.id);
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Parse plan info from external_id
      const planInfo = invoice.external_id.split('_')[0]; // This should contain the plan type
      const planId = planInfo === 'invoice' ? 'monthly' : planInfo; // Default to monthly if not specified

      // Calculate subscription end date based on plan
      const startDate = new Date();
      const endDate = new Date(startDate);
      
      if (subscriptionPlans[planId]) {
        endDate.setDate(startDate.getDate() + subscriptionPlans[planId].validityDays);
      }

      // Update user subscription
      await user.update({
        subscriptionType: planId,
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate
      });

      console.log(`Subscription updated for user ${user.id} - Plan: ${planId}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling payment webhook:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
};

// Get subscription status for current user
const getSubscriptionStatus = async (req, res) => {
  try {
    const { user } = req;

    const subscriptionInfo = {
      subscriptionType: user.subscriptionType || 'free',
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate,
      isExpired: user.subscriptionEndDate ? new Date() > new Date(user.subscriptionEndDate) : true,
      daysRemaining: user.subscriptionEndDate 
        ? Math.ceil((new Date(user.subscriptionEndDate) - new Date()) / (1000 * 60 * 60 * 24))
        : 0
    };

    res.status(200).json({
      success: true,
      data: subscriptionInfo
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription status'
    });
  }
};

module.exports = {
  createInvoice,
  handlePaymentWebhook,
  getSubscriptionStatus
};