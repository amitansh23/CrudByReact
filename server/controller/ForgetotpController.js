import otpGenerator from 'otp-generator';
import OTP from '../model/otpModel.js';
import User from '../model/userModel.js';


const forgetotp = async (req, res) => {
  try {
    const { email } = req.body;
    
    const checkUserPresent = await User.findOne({ email });
    
    if (!checkUserPresent) { // YE FORGOT PASSWORD KE LIYE HAI
     
      return res.status(401).json({
        success: false,
        message: 'User not exist' // YE FORGOT KE LIYE
      });
    }
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default forgetotp;