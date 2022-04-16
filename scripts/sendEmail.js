import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendMail = (email, attachment, id) => {
    // Create png file as attachment
    const file = {
        filename: "map.png",
        content: attachment,
    };

    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "MAP",
        text: "There you go! Please remmember your id: " + id,
        attachments: [file],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.response);
    });
};

export default sendMail;
