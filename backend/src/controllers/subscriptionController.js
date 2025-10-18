const { Xendit } = require('xendit-node');
const { User } = require('../models');
require('dotenv').config();

// Initialize Xendit
const xendit = new Xendit({
  secretKey: process.env.XENDIT_API_KEY,
  environment: process.env.XENDIT_MODE || 'development',
});

const { Invoice } = xendit;
const invoiceClient = new Invoice();

// Subscription plans
const subscriptionPlans = {
  monthly: {
    id: 'monthly',
    name: '1 Month Plan',
    amount: 29000,
    description: '1 Month Premium Subscription Plan',
    validityDays: 30,
  },
  quarterly: {
    id: 'quarterly',
    name: '3 Months Plan',
    amount: 69000,
    description: '3 Months Premium Subscription Plan',
    validityDays: 90,
  },
  annual: {
    id: 'annual',
    name: '1 Year Plan',
    amount: 259000,
    description: '1 Year Premium Subscription Plan',
    validityDays: 365,
  },
};

// Create Xendit invoice
const createInvoice = async (req, res) => {
  try {
    const { planId } = req.body;
    const { user } = req;

    // Validate plan
    if (!subscriptionPlans[planId]) {
      return res.status(400).json({ success: false, message: 'Invalid subscription plan' });
    }
    const plan = subscriptionPlans[planId];

    // Prepare payload with correct snake_case for Xendit v7
    const payload = {
      external_id: `invoice_${user.id}_${Date.now()}`,
      amount: plan.amount,
      payer_email: user.email,
      description: plan.description,
      success_redirect_url: 'https://hyyyume.my.id/payment-success',
      failure_redirect_url: 'https://hyyyume.my.id/payment-failed',
    };

    console.log('Payload for Xendit invoice:', payload);

    // Create invoice
    const createdInvoice = await invoiceClient.createInvoice({ data: payload });

    res.status(200).json({
      success: true,
      message: 'Invoice created successfully',
      data: {
        invoiceUrl: createdInvoice.invoice_url,
        invoiceId: createdInvoice.id,
        amount: createdInvoice.amount,
        expiryDate: createdInvoice.expiry_date,
      },
    });
  } catch (error) {
    console.error('Full Xendit error:', error.response?.data || error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice',
      error: error.message,
    });
  }
};

// Webhook to handle Xendit payment events
const handlePaymentWebhook = async (req, res) => {
  try {
    const { event_type, data } = req.body;

    if (event_type === 'invoice.paid') {
      const invoiceData = data;
      const userId = invoiceData.external_id.split('_')[1];

      // Find user
      const user = await User.findByPk(userId);
      if (!user) {
        console.error('User not found for invoice:', invoiceData.id);
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Determine plan from external_id
      const planInfo = invoiceData.external_id.split('_')[0];
      const planId = planInfo === 'invoice' ? 'monthly' : planInfo;

      // Calculate subscription end date
      const startDate = new Date();
      const endDate = new Date(startDate);
      if (subscriptionPlans[planId]) {
        endDate.setDate(startDate.getDate() + subscriptionPlans[planId].validityDays);
      }

      // Update user subscription
      await user.update({
        subscriptionType: planId,
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
      });

      console.log(`Subscription updated for user ${user.id} - Plan: ${planId}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling payment webhook:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
};

// Get current subscription status
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
        : 0,
    };

    res.status(200).json({ success: true, data: subscriptionInfo });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ success: false, message: 'Failed to get subscription status' });
  }
};

module.exports = {
  createInvoice,
  handlePaymentWebhook,
  getSubscriptionStatus,
};
