import jwt from 'jsonwebtoken';
const secret = 'Amitansh@1234';

export function setUser(user){
    return jwt.sign({
        _id : user._id,
        email: user.email
    },secret);
}

            
// export function getUser(req, res, next) {
//     try {
//         // Check if session and token exist
//         if (!req.session || !req.session.user || !req.session.user.token) {
//             return res.status(401).json({ msg: "Token not found in session", success: false });
//         }

//         const token = req.session.user.token;

//         // Verify the token
//         jwt.verify(token, secret, (err, decoded) => {
//             if (err) {
//                 console.error("JWT verification failed:", err);
//                 return res.status(401).json({ msg: "Invalid Token", success: false });
//             }

//             // Store the verified user data in request object
//             req.user = decoded; 
//             req.token = token;
//             // console.log("Decoded User Data:", decoded);

//             next(); 
//         });
//     } catch (error) {
//         console.error("Error in token verification:", error);
//         return res.status(500).json({ msg: "Server error", success: false });
//     }
// }

        
        





export function getUser(req, res, next) {
    try {

        if (!req.session || !req.session.user || !req.session.user.token) {
            return res.status(401).json({ msg: "Token not found in session", success: false });
        }

        const token = req.session.user.token;

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                console.error("JWT verification failed:", err);
                return res.status(401).json({ msg: "Invalid Token", success: false });
            }
            req.user = decoded;  
            req.token = token;

            next(); 
        });
    } catch (error) {
        console.error("Error in token verification:", error);
        return res.status(500).json({ msg: "Server error", success: false });
    }
}

