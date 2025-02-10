import bcrypt from 'bcrypt';
import User from '../model/userModel.js';
import OTP from '../model/otpModel.js';


const signup = async (req, res) => {
  try {
    const { fname, lname, email, password, address, phone , otp, role } = req.body;
    // Check if all details are provided
    if (!fname || !lname || !email || !password || !otp || !address || !phone) {
      return res.status(403).json({
        success: false,
        message: 'All fields are required',
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }
    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: 'The OTP is not valid',
      });
    }
    // Secure password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Hashing password error for ${password}: ` + error.message,
      });
    }
    const newUser = await User.create({
      fname,
      lname,
      email,
      password: hashedPassword,
      address,
      phone,
      role,
    });
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default signup;