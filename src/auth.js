const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');


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
router.post('/forgot-password', asyncHandler(async (req, res) => {
const { email } = req.body;
if (!email) return res.status(400).json({ message: 'Please provide email' });


const user = await User.findOne({ email });
if (!user) return res.status(200).json({ message: 'If that email is registered, a reset link was sent.' }); // don't reveal


const resetToken = user.createPasswordResetToken();
await user.save({ validateBeforeSave: false });


const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
const message = `You requested a password reset. Click here: ${resetURL}\nIf you did not request this, please ignore.`;
try {
await sendEmail({
to: user.email,
subject: 'Password reset token',
text: message,
html: `<p>You requested a password reset. Click the link below to reset:</p><p><a href="${resetURL}">${resetURL}</a></p>`
});
res.json({ message: 'Password reset link sent if email exists' });
} catch (err) {
// cleanup
user.resetPasswordToken = undefined;
user.resetPasswordExpires = undefined;
await user.save({ validateBeforeSave: false });
console.error('Error sending email', err);
res.status(500).json({ message: 'Error sending email' });
}
}));


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