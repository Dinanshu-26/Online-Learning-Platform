const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
require("dotenv").config();

exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
            });
        }

        const token = crypto.randomBytes(20).toString("hex");

        const updatedDetails = await User.findOneAndUpdate({ email }, {
            token: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000,
        },
            { new: true });
        console.log("Updated details: ", updatedDetails);

        const url = `http://localhost:3000/update-password/${token}`;

        await mailSender(
            email,
            "Password Reset",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
        );

        res.json({
            success: true,
            message:
                "Email Sent Successfully, Please Check Your Email to Continue Further",
        });

    } catch (error) {
        return res.json({
            error: error.message,
            success: false,
            message: `Some Error in Sending the Reset Message`,
        });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: "Password and Confirm Password Does not Match",
            });
        }

        const userDetails = await User.findOne({ token });

        if (!userDetails) {
            return res.json({
                success: false,
                message: "Token is Invalid",
            });
        }

        if (!(userDetails.resetPasswordExpires > Date.now())) {
            return res.status(403).json({
                success: false,
                message: `Token is Expired, Please Regenerate Your Token`,
            });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate({ token }, {
            password: encryptedPassword,
        }, { new: true });

        res.json({
            success: true,
            message: `Password Reset Successful`,
        });

    } catch (error) {
        return res.json({
            error: error.message,
            success: false,
            message: `Some Error in Updating the Password`,
        });
    }
}