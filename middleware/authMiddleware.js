const jwt = require("jsonwebtoken");
require("dotenv").config();
const {User} = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ msg: "Access denied, no token provided." });

    const token = authHeader.split(" ")[1];

    try{
        const decode = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        const user = await User.findByPk(decode.id);
        if(!user) return res.status(401).json({message: "Invalid token"})
        req.user = user;
        
        next();
    } catch (err) {
        res.status(400).json({msg: "Error occured while verifying token.", err});
    }
};

exports.authorize = (requiredRole=[]) => {
    return async (req, res, next) => {
        try {
            const userRole = req.user.role;

            if(!requiredRole.includes(userRole)){
                return res.status(403).json({msg: `Access denied: ${userRole} role not authorized`});
            }

            next();
        } catch (err) {
            res.status(403).json({msg: "Forbidden: Admin privileges only"})
        }
    }
}
