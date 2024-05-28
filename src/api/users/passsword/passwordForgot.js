const { getSocialMediaInfo } = require("../../../lib/users/passwordForgot/passwordForgot");


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

module.exports = { getingSubAdminSocialLink };