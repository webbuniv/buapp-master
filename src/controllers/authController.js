import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/emailUtils.js';

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
const sendOTPEmail = async (email, otp, name) => {
  const subject = 'Bugema University - OTP Verification';
  const templatePath = './src/templates/otpTemplate.html';  // Your HTML template for OTP
  const replacements = { otp, name };
  await sendEmail(email, subject, templatePath, replacements);
};

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password, role, registrationNumber, avatar } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP for email verification
    const otp = generateOTP();
    
    // Create new user instance
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      registrationNumber,
      avatar,
      verificationToken: otp,  // Store OTP for verification
    });

    // Save user to the database
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    res.status(201).send('User registered successfully. Please check your email for OTP.');

  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if OTP matches
    if (user.verificationToken === otp) {
      // Mark user as verified
      user.isVerified = true;
      user.verificationToken = null;  // Clear the OTP after successful verification
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).send({ message: 'Account verified successfully', token });
    } else {
      res.status(400).send('Invalid OTP');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error verifying OTP');
  }
};

// Send Password Reset Email
export const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Store the reset token and expiry time
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Send password reset email
    const subject = 'Password Reset Request';
    const templatePath = './src/templates/passwordResetTemplate.html';
    const replacements = { resetLink, name: user.name };
    
    await sendEmail(email, subject, templatePath, replacements);

    res.status(200).send('Password reset email sent');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending password reset email');
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    // Find user by reset token and expiry
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).send('Invalid or expired reset token');

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;

    // Clear the reset token and expiry
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();
    res.status(200).send('Password reset successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error resetting password');
  }
};
