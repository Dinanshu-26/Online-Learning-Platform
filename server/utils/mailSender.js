// const nodemailer = require("nodemailer");
require("dotenv").config();

// const mailSender = async (email, title, body) => {
//     try {
//         let transporter = nodemailer.createTransport({
//             host: process.env.MAIL_HOST,
//             auth: {
//                 user: process.env.MAIL_USER,
//                 pass: process.env.MAIL_PASS,
//             }
//         });

//         let info = await transporter.sendMail({
//             from: 'StudyNotion || CodeHelp - by Dino',
//             to: email ,
//             subject: title ,
//             html: body,
//         });
//         console.log("Info: ",info);
//         return info ;
//     } catch (error) {
//         console.log(error.message) ;
//     }
// }

// const mailSender = async (email, title, body) => {
//     try {

//         console.log("📨 Creating transporter with:");
//         console.log("HOST:", process.env.MAIL_HOST);
//         console.log("USER:", process.env.MAIL_USER);

//         let transporter = nodemailer.createTransport({
//             host: process.env.MAIL_HOST,
//             auth: {
//                 user: process.env.MAIL_USER,
//                 pass: process.env.MAIL_PASS,
//             },
//         });

//         console.log("✅ Transporter created. Sending mail...");

//         let info = await transporter.sendMail({
//             from: `StudyNotion || CodeHelp - by Dino <${process.env.MAIL_USER}>`,
//             to: email,
//             subject: title,
//             html: body,
//         });

//         console.log("📧 Mail sent successfully!");
//         console.log("MessageId:", info.messageId);
//         console.log("Preview URL (if using ethereal):", nodemailer.getTestMessageUrl(info));

//         return info;
//     } catch (error) {
//         console.error("❌ Error sending mail:", error.message);
//         throw error;
//     }
// };

// module.exports = mailSender;

// mailSender.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
    try {
        console.log("📨 Sending email using Resend to:", email);

        const data = await resend.emails.send({
            from: "StudyNotion <studynotion@resend.dev>",
            to: email,
            subject: title,
            html: body,
        });

        console.log("📧 Email sent successfully. ID:", data.id);
        return data;

    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw error;
    }
};

// mailSender.js
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const mailSender = async (email, title, body) => {
//     try {
//         console.log("📨 Sending Gmail MAIL email to:", email);

//         const transporter = nodemailer.createTransport({
//             host: process.env.MAIL_HOST,       
//             port: 587,      
//             secure: false,                     
//             auth: {
//                 user: process.env.MAIL_USER,    
//                 pass: process.env.MAIL_PASS,     
//             },
//         });

//         const mailOptions = {
//             from: `StudyNotion <${process.env.MAIL_USER}>`,
//             to: email,
//             subject: title,
//             html: body,
//         };

//         const info = await transporter.sendMail(mailOptions);

//         console.log("📧 Mail sent:", info.messageId);
//         return info;

//     } catch (error) {
//         console.error("❌ Email send error:", error);
//         throw error;
//     }
// };

module.exports = mailSender;
