const Jwt = require("jsonwebtoken");
const User = require("../models/userRegister.js")

const authenticate = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    console.log("token", token);
    try {
        if (!token) {
            return res.status(404).json({
                success: false,
                message: "Unauthorized request Token is missing!",
            });
        }

        const decodedToken = Jwt.verify(token, process.env.TOKEN_SECRET)
        console.log("decoded", decodedToken?._id)

        if (!decodedToken) {
            return res.status(401).json({ success: false, message: "Invalid request!" })
        }
        next()

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Invalid access token" });
    }
};

module.exports = authenticate;
