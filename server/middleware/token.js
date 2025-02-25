import jwt from 'jsonwebtoken';
const secret = 'Amitansh@1234';

export function setUser(user){
    return jwt.sign({
        _id : user._id,
        email: user.email
    },secret);
}

            
export function getUser(req, res, next) {
    try {
        // Check if session and token exist
        if (!req.session || !req.session.user || !req.session.user.token) {
            return res.status(401).json({ msg: "Token not found in session", success: false });
        }

        const token = req.session.user.token;

        // Verify the token
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                console.error("JWT verification failed:", err);
                return res.status(401).json({ msg: "Invalid Token", success: false });
            }

            // Store the verified user data in request object
            req.user = decoded; 
            req.token = token;
            // console.log("Decoded User Data:", decoded);

            next(); 
        });
    } catch (error) {
        console.error("Error in token verification:", error);
        return res.status(500).json({ msg: "Server error", success: false });
    }
}

        
        


// import jwt from "jsonwebtoken";
// import User from "../model/userModel.js";  // Import user model

// const secret = "Amitansh@1234";

// // ✅ Generate JWT Token
// export function setUser(user) {
//     return jwt.sign(
//         { _id: user._id, email: user.email }, 
//         secret, 
//         { expiresIn: "7d" }  // Token expires in 7 days
//     );
// }

// // // ✅ Middleware to Verify JWT & Attach User
// export async function getUser(req, res, next) {
//     try {
//         const token = req.cookies?.token || req.headers["authorization"]; // Fetch token

//         if (!token) {
//             return res.status(401).json({ msg: "Unauthorized: No token provided", success: false });
//         }

//         const decoded = jwt.verify(token, secret); // Verify token

//         const user = await User.findById(decoded._id).select("-password"); // Fetch user from DB
//         if (!user) {
//             return res.status(404).json({ msg: "User not found", success: false });
//         }

//         req.user = user; // Attach user to request
//         req.token = token;

//         next(); // Move to next middleware
//     } catch (error) {
//         console.error("JWT verification failed:", error);
//         return res.status(401).json({ msg: "Invalid token", success: false });
//     }
// }

