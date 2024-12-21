import { getSocialMediaInfo, passowrdForgot } from "../../../lib/users/passwordForgot/passwordForgot.js";

// geting Subadmin Validation Social media link for password forget 
const getingSubAdminSocialLink = async (req, res) => {
    try {
        const authorId = req.query.authorId;
        const finalResult = await getSocialMediaInfo(authorId);
        res.status(200).json(finalResult);
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    };
};

//  password forget

const passwordForgotuser = async (req, res) => {
    try {
        const userName = req.query.userName;
        const newPassword = req.query.newPassword;
        const finalResult = await passowrdForgot(userName,newPassword) 
        res.status(200).json(finalResult);
        } catch (error) {
            res.status(500).json({
                error: error.message,
            })
        }
};

export { getingSubAdminSocialLink, passwordForgotuser };