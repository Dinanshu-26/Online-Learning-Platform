const nodemailer = require("nodemailer");

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

const mailSender = async (email, title, body) => {
    try {
        // Log transport config (mask password for safety)
        console.log("📨 Creating transporter with:");
        console.log("HOST:", process.env.MAIL_HOST);
        console.log("USER:", process.env.MAIL_USER);

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        console.log("✅ Transporter created. Sending mail...");

        let info = await transporter.sendMail({
            from: `StudyNotion || CodeHelp - by Dino <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body,
        });

        console.log("📧 Mail sent successfully!");
        console.log("MessageId:", info.messageId);
        console.log("Preview URL (if using ethereal):", nodemailer.getTestMessageUrl(info));

        return info;
    } catch (error) {
        console.error("❌ Error sending mail:", error.message);
        throw error;
    }
};

module.exports = mailSender;