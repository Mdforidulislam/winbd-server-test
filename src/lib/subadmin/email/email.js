import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { EmailBox } from '../../../models/email.js';

dotenv.config();

const getingSubAdminEmaildata = async (authoreId) => { 
    try { 
        const getngEmail = await EmailBox.findOne({ authoreId: authoreId }).lean();
      
        if (getngEmail) {
            return { message: "successfully geting user", getngEmail };
        } else {
            return { message: "email don't match with authId" };
        }
    } catch (error) { return error; }
};

// email update here 
const emailGetingFromSubAdmin = async (authorId, infoSubAdmin) => {
    try {
        

        // Try to find and update the email entry
        const emailGetAndUpdate = await EmailBox.findOneAndUpdate(
            { authoreId: authorId },
            { $set: infoSubAdmin },  // Use $set to update only the fields provided in infoSubAdmin
            { new: true, useFindAndModify: false, upsert: true }
        ).lean();

        // If an entry was found and updated
        if (emailGetAndUpdate) {
            return { message: "Email updated successfully", emailGetAndUpdate };
        }
    } catch (error) {
        // Log the error for debugging purposes
        console.error(error);
        return { message: "An error occurred", error };
    }
};

const sendEmail = async (subject, text, email) => {
    const EMAIL_USER = "winbdt.payment@gmail.com";
    const EMAIL_PASS = "jyfdszlleqrfhxum";
    const SUBADMIN_EMAIL = email;

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
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export { sendEmail, emailGetingFromSubAdmin, getingSubAdminEmaildata };
