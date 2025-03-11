import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OTPVerification = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const sendOTP = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/send-otp", { phoneNumber });
            toast.success(response.data.msg);
            setIsOTPSent(true);
        } catch (error) {
            toast.error(error.response?.data?.msg || "Failed to send OTP");
        }
    };

    const verifyOTP = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/verify-otp", { phoneNumber, otp });
            toast.success(response.data.msg);
            setIsVerified(true);
        } catch (error) {
            toast.error(error.response?.data?.msg || "Invalid OTP");
        }
    };

    return (
        <div style={{ width: "300px", margin: "auto", textAlign: "center", padding: "20px", border: "1px solid #ccc" }}>
            <h2>Phone Verification</h2>

            {!isVerified ? (
                <>
                    <input
                        type="text"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isOTPSent}
                        style={{ display: "block", margin: "10px auto", padding: "8px", width: "100%" }}
                    />
                    {!isOTPSent ? (
                        <button onClick={sendOTP} style={{ padding: "10px", width: "100%", cursor: "pointer" }}>
                            Send OTP
                        </button>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                style={{ display: "block", margin: "10px auto", padding: "8px", width: "100%" }}
                            />
                            <button onClick={verifyOTP} style={{ padding: "10px", width: "100%", cursor: "pointer" }}>
                                Verify OTP
                            </button>
                        </>
                    )}
                </>
            ) : (
                <h3> Phone Verified Successfully!</h3>
            )}
        </div>
    );
};

export default OTPVerification;
