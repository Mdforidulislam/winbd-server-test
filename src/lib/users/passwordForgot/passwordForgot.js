const SocialMediaLink = require("../../../models/SocialMedia");


// geting users contact info socail media whatApps, facebook form subamdin

const getSocialMediaInfo = async (authorId) => {
    try {
        if (!authorId) {
            return { error: "Please provide a correct authorId" };
        }

        const socialMediaInfo = await SocialMediaLink.findOne({
            $or: [
                { authorId: authorId },
                {role: 'admin'}
        ]}, { socialMediaLinks: 1, imgLink: 1, _id: 0 }).lean();

        if (socialMediaInfo) {
            return {
                message: "Successfully retrieved social media information",
                data: socialMediaInfo,
            };
        } else {
            return { message: "No data found for the provided authorId" };
        }
    } catch (error) {
        return { error: error.message };
    }
};


module.exports = { getSocialMediaInfo };
