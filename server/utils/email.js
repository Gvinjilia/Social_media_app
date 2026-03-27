const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: process.env.USER_NAME,
        pass: process.env.USER_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    try{
        await transporter.sendMail({
            from: 'Chatbook',
            to,
            subject,
            html
        });
    }catch(err){
        console.log('error', err)
    }
};

module.exports = sendEmail;