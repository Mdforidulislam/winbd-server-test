const Admin = require("../../../models/admin");
const SocialMediaLink = require("../../../models/SocialMedia");
const { UserList } = require("../../../models/users");


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


// password forgot userNmaeandPassword

    const passowrdForgot = async (userName, newPassword) => {
        try {
            if (userName === '' || newPassword === '') {
                return { message: "Please provide a valid username and newPassword" };
            }

            console.log(userName,newPassword);
            // Grouping collections
            const updateResults = [];

            // Update password in user collection
            const userResult = await UserList.updateOne(
                { userName: userName },
                { $set: { password: newPassword } }
            );
            updateResults.push(userResult);

            // Update password in admin collection
            const adminResult = await Admin.updateOne(
                { subAdmin: userName },
                { $set: { password: newPassword } }
            );
            updateResults.push(adminResult);

            return { message: "Password updated successfully", updateResults };
        } catch (error) {
            return error;
        }
    };


module.exports = { getSocialMediaInfo,passowrdForgot };
