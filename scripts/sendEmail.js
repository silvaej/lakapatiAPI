import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const sendMail = async (email, attachment, id) => {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL
    );

    oAuth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
    });

    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        // Create png file as attachment
        const file = {
            filename: "map.png",
            content: attachment,
        };

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Lakapati Result Mapping",
            text: `Thank you for using Lakapati. \nAttached below is the mapping of the results.\n\tMap with id: ${id}`,
            attachments: [file],
        };

        const result = await smtpTransport.sendMail(mailOptions);

        return result;
    } catch (error) {
        return error;
    }
};

export default sendMail;
