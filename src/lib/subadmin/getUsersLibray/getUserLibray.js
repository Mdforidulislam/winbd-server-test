const { UserList } = require("../../../models/users");

// geting user infomation show data to the subadmin page 
const getUsersLibray = async (uniqueId, searchValue, pageNumbers, perPage = 20) => {
    try {
        // Validate input parameters
        if (!uniqueId) {
            return { message: "Please provide unique Id" };
        }

        // Calculate the number of documents to skip
        const skipCount = pageNumbers * perPage;

        // Build the query condition
        const queryCondition = {
            authorId: uniqueId,
            ...(searchValue && { userName: { $regex: searchValue, $options: 'i' } }) // Case-insensitive search
        };

        // Fetch the user data
        const queryUserInfo = await UserList.find(queryCondition)
            .skip(skipCount)
            .limit(perPage)
            .exec();

        // Return the user data
        if (queryUserInfo.length > 0) {
            return { message: "Successfully fetched user data", queryUserInfo };
        } else {
            return { message: "No users found matching the criteria" };
        }

    } catch (error) {
        console.error('Error fetching user data:', error);
        return { message: "An error occurred while fetching user data", error };
    }
};



// geting Count Register user

const getingRegisterUserCount = async (authoredId) => {
    try {
        const getingReigsterUserList = await UserList.find({ authorId: authoredId }).countDocuments().lean();
        const getingCounterUser = Math.ceil(getingReigsterUserList / 20);
        if (getingCounterUser) {
            return getingCounterUser;
        } else {
            return { message: "Register user count is problems" };
        };
     } catch (error) {
        return error;
    }
};

module.exports = { getUsersLibray ,getingRegisterUserCount};


