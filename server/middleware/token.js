import jwt from 'jsonwebtoken';
const secret = 'Amitansh@1234';

export function setUser(user){
    return jwt.sign({
        _id : user._id,
        email: user.email
    },secret);
}

            
export function getUser(req, res, next) {
    const token = req.headers.auth; // Getting the token from headers

    if (!token) {
        return res.status(401).json({ msg: "Token not found", success: false });
    }

    try {
        const data = jwt.verify(token, secret);
        if (data) {
            req.user = data; // Storing the verified user data in request object
            next(); // Proceed to the next middleware or route
        } else {
            return res.status(401).json({ msg: "Unauthorized User", success: false });
        }
    } catch (error) {
        return res.status(401).json({ msg: "Invalid Token", success: false });
    }
}

        
        



