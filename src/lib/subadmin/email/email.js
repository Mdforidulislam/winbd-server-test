require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async (subject, text) => {

  const   EMAIL_USER =  "mdforidulislam962@gmail.com"
  const   EMAIL_PASS = "24681012Ab@#"
  const  SUBADMIN_EMAIL = "ekpoysarferiwayala@gmail.com"

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
