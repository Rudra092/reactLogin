const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
import { sendResetEmail } from './sendEmail.js';

const User = require('./user');
const sendEmail = require('./sendEmail');


// Helpers
const generateToken = (id) => {
return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};


// @route POST /api/auth/signup
// @desc Register user
router.post('/signup', asyncHandler(async (req, res) => {
const { name, email, password } = req.body;
if (!name || !email || !password) return res.status(400).json({ message: 'Please provide name, email and password' });


const existing = await User.findOne({ email });
if (existing) return res.status(400).json({ message: 'Email already in use' });


const user = await User.create({ name, email, password });
res.status(201).json({
_id: user._id,
name: user.name,
email: user.email,
token: generateToken(user._id),
});
}));


// @route POST /api/auth/login
// @desc Login user
router.post('/login', asyncHandler(async (req, res) => {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });


const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });


const isMatch = await user.matchPassword(password);
if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });


res.json({
_id: user._id,
name: user.name,
email: user.email,
token: generateToken(user._id),
});
}));


// @route POST /api/auth/forgot-password
// @desc Create reset token and send email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
    }

    // 2️⃣ Generate reset token + link
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetLink = `https://yourfrontendsite.com/reset-password?token=${resetToken}`;

    // 3️⃣ Send email
    await sendResetEmail(email, resetLink);

    // 4️⃣ Save token in DB (optional)
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    res.status(200).json({ message: "Reset email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send reset email" });
  }
});

// @route POST /api/auth/reset-password/:token
// @desc Reset password
router.post('/reset-password/:token', asyncHandler(async (req, res) => {
const { token } = req.params;
const { password } = req.body;
if (!password) return res.status(400).json({ message: 'Please provide new password' });


const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
const user = await User.findOne({
resetPasswordToken: hashedToken,
resetPasswordExpires: { $gt: Date.now() }
});


if (!user) return res.status(400).json({ message: 'Token invalid or expired' });


user.password = password; // pre('save') will hash
user.resetPasswordToken = undefined;
user.resetPasswordExpires = undefined;
await user.save();


res.json({ message: 'Password reset successful' });
}));


module.exports = router;