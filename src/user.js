const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const UserSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true, lowercase: true },
password: { type: String, required: true, minlength: 6 },
resetPasswordToken: String,
resetPasswordExpires: Date,
}, { timestamps: true });


// Hash password before save
UserSchema.pre('save', async function (next) {
if (!this.isModified('password')) return next();
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
next();
});


UserSchema.methods.matchPassword = async function (enteredPassword) {
return await bcrypt.compare(enteredPassword, this.password);
};


UserSchema.methods.createPasswordResetToken = function () {
const resetToken = crypto.randomBytes(32).toString('hex');
// store hashed token in DB
this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
this.resetPasswordExpires = Date.now() + parseInt(process.env.RESET_PASSWORD_TOKEN_EXPIRES || '3600000');
return resetToken; // unhashed token - send via email
};


module.exports = mongoose.model('User', UserSchema);