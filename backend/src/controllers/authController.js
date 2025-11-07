const jwt = require('jsonwebtoken');
const { User } = require('../models');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Cek jika user sudah ada
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user with unverified status
    const user = await User.create({ 
      email, 
      password,
      emailVerificationToken: verificationToken,
      isEmailVerified: false
    });

    // Send verification email
    const verificationUrl = `https://hyyyume.my.id/verify-email?token=${verificationToken}&email=${email}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification - HY.YUME Monitor',
      html: `
        <h2>Welcome to HY.YUME Monitor!</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't register for an account, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        user: {
          id: user.id,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;

    // Find user by email and verification token
    const user = await User.findOne({ 
      where: { 
        email, 
        emailVerificationToken: token 
      } 
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification link'
      });
    }

    // Check if token has expired (24 hours)
    const tokenAge = (Date.now() - new Date(user.updatedAt).getTime()) / 1000 / 60 / 60;
    if (tokenAge > 24) {
      return res.status(400).json({
        success: false,
        message: 'Verification link has expired'
      });
    }

    // Update user to verified
    await user.update({
      isEmailVerified: true,
      emailVerificationToken: null
    });

    res.json({
      success: true,
      message: 'Email verified successfully. You can now log in to your account.'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Cari user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email address before logging in'
      });
    }

    // Validasi password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          subscriptionType: user.subscriptionType,
          subscriptionEndDate: user.subscriptionEndDate
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          subscriptionType: req.user.subscriptionType,
          subscriptionEndDate: req.user.subscriptionEndDate,
          isEmailVerified: req.user.isEmailVerified
        }
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  getProfile
};