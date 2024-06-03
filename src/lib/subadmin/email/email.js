require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async (subject, text) => {

  const   EMAIL_USER =  "ekpoysarferiwayala@gmail.com"
  const   EMAIL_PASS = "ukhipebjnqtlynsl"
  const  SUBADMIN_EMAIL = "mdforidulislam962@gmail.com"

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });

    const mailOptions = {
        from: SUBADMIN_EMAIL,
        to: SUBADMIN_EMAIL,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
