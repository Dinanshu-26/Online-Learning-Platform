const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60,
    }
});

// async function sendVerificationEmail(email, otp){
//     try {
//         const mailResponse = await mailSender(email,"Verification email from StudyNotion", otp);
//         console.log("Email sent succesfully", mailResponse) ;
//     } catch (error) {
//         console.log("Error occured while sending email: ", error) ;
//         throw error;
//     }
// }

// otpSchema.pre("save",async function(next) {
//     await sendVerificationEmail(this.email, this.otp) ;
//     next() ;
// }) ;

// async function sendVerificationEmail(email, otp) {

//     try {
//         const mailResponse = await mailSender(
//             email,
//             "Verification Email",
//             emailTemplate(otp)
//         );
//         console.log("Email sent successfully: ", mailResponse.response);
//     } catch (error) {
//         console.log("Error occurred while sending email: ", error);
//         throw error;
//     }
// }

// otpSchema.pre("save", async function (next) {
//     console.log("New document saved to database");

//     if (this.isNew) {
//         await sendVerificationEmail(this.email, this.otp);
//     }
//     next();
// });

async function sendVerificationEmail(email, otp) {
    try {
        console.log("📨 Sending verification email...");

        const response = await mailSender(
            email,
            "Verification Email",
            emailTemplate(otp)
        );

        console.log("📧 Email sent successfully:", response?.id || response);
    } catch (error) {
        console.error("❌ Could not send verification email:", error);
        throw error;
    }
}

otpSchema.pre("save", async function (next) {
    console.log("🟦 OTP document ready to save");

    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }

    next();
});

module.exports = mongoose.model("OTP", otpSchema);