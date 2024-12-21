import { insertSocialMediaContactUsers, getSocialMediaLink } from "../../../lib/subadmin/SocialMedia/index.js";

// insert the subadmin social media info
const insertSocialMediaLink = async (req, res) => {
    try {
        const socialMediaInfo = req.body;
        const finalResult = await insertSocialMediaContactUsers(socialMediaInfo);
        res.status(400).json(finalResult);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

// geting social link here
const getingSocialLink = async (req, res) => {
    try { 
        const authorId = req.query.authorId;
        const finalResult = await getSocialMediaLink(authorId)
        res.status(200).json(finalResult);
        } catch (error) {
            res.status(500).json({
                error: error.message,
            });
        }
};


export { insertSocialMediaLink, getingSocialLink };

