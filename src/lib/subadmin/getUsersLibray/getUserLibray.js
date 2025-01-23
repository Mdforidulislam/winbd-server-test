
import { UserList } from "../../../models/users.js";


// geting user infomation show data to the subadmin page 
const getUsersLibray = async (uniqueId, searchValue, pageNumbers, perPage = 50) => {
   
    try {
        if (!uniqueId) {
            return { message: "Please provide unique Id" };
        }

        console.log(`Unique ID: ${uniqueId}, Search Value: ${searchValue}, Page Number: ${pageNumbers}`);

        ;

        // search sriteria below
        const queryCondition = { authorId: uniqueId, };
        if (searchValue) {
            const searchRegex = new RegExp(searchValue, 'i');
            queryCondition.$or = [
                { phoneNumber: { $regex: searchRegex } },
                { userName: { $regex: searchRegex } }
            ]
        };

        
        const [userInfo,totalLength] = await Promise.all([
            UserList.find(queryCondition)
                .sort({ _id: 1 })  // Sort by _id in ascending order
                .skip(perPage * pageNumbers)
                .limit(perPage),
            UserList.countDocuments(queryCondition),
        ]);

        //  don't exite data inside the database here 
        if (userInfo.length === 0) {
            return { message: "don't match data inside the database" };
        };

        //  calculation the page
        const totalPages = Math.ceil(totalLength / perPage);


        return { success: true, userInfo, totalPages };
        
    } catch (error) {
        console.error('Error fetching user data:', error);
        return { message: "An error occurred while fetching user data", error: error.message };
    }
};


export {getUsersLibray}


