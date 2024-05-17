const { UserList } = require("../../../models/users");

// geting user infomation show data to the subadmin page 
const getUsersLibray = async (uniqueId , searchValue ,pageNumbers, perPage = 20 ) => {
    try { 
        console.log(uniqueId, searchValue, pageNumbers, 'check the data call api form get data ' );
        if (uniqueId === '' || !uniqueId  ) {
            return { message: "Please provide unique Id" };
        };


        if (pageNumbers >= 0 && uniqueId || !searchValue || searchValue) {
            const skipsCount = pageNumbers * perPage;
            const withOutSearch = await UserList.find({authorId: uniqueId}).skip(skipsCount).limit(perPage);
            const searchValueUser = await UserList.find({ $and: [{ authorId: uniqueId }, { userName: searchValue }] }).skip(skipsCount).limit(perPage);
            const totalLenghtData = (await UserList.find({ authorId: uniqueId })).length;
            const totalPageNumber = Math.ceil(totalLenghtData / perPage); 

            const queryUserInfo = searchValueUser.length <= 0 ? withOutSearch : searchValueUser;
            if (queryUserInfo && totalLenghtData) {
                return { message: "successfully geting data list", queryUserInfo , totalPageNumber };
            }
        }

        return { message: "user don't register udner subamdin" };

    } catch (error) { return error };
}

module.exports = { getUsersLibray };


