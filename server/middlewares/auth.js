const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.auth = async (req, res, next) => {
    try {
        const token =
            req.cookies.token ||
            req.header("Authorization")?.replace("Bearer ", "") ||
            req.body.token;


        if (!token) {
            return res.status(401).json({
                success: false,
                messsage: "token not found"
            });
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            req.user = payload;
        } catch (error) {
            return res.status(401).json({
                success: false,
                messsage: "Token invalid"
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            messsage: "Something went wrong while verifying the token"
        });
    }
}

exports.isStudent = (req, res, next) => {
    try {
        if (req.user.accountType !== "student") {
            return res.status(400).json({
                success: false,
                message: "This is a protected route for students"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            messsage: "User role is not matching"
        });
    }
}

exports.isInstructor = (req, res, next) => {
    try {
        if (req.user.accountType !== "instructor") {
            return res.status(400).json({
                success: false,
                message: "This is a protected route for Instructors"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            messsage: "User role is not matching"
        });
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.accountType != "admin") {
            return res.status(400).json({
                success: false,
                message: "This is a protected route for Admins"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            messsage: "User role is not matching"
        });
    }
}