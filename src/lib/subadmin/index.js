const Admin = require("../../models/admin");

// insert data to databse 
const insertSubAdmin = async (subAdminInfo) => {
    try {

        console.log('call api', Object.values(subAdminInfo),subAdminInfo,typeof(subAdminInfo.adminName),  typeof(subAdminInfo.uniqueId),typeof(subAdminInfo.password),typeof(subAdminInfo.phoneNumber));
        // object validation subadmininfo
        if (Object.keys(subAdminInfo).length === 0) {
            return { message: 'please provide correct data' }
        } else {
            const isValidation = Object.values(subAdminInfo).every(item => item);
            if (!isValidation) {
                return { message: 'Input value is missing' }
            }
        }


        // insert data to database 
        if (subAdminInfo) {
           
            const isExite = await Admin.findOne({ subAdmin: subAdminInfo.subAdmin, uniqueId: subAdminInfo.uniqueId }) // check the validation 
            console.log(isExite)
            if (!isExite) {
                const reuslt = await Admin.create(subAdminInfo); reuslt.save() // save data to database 
                if (Object.values(reuslt).length > 0) {
                    return { message: 'subadmin insert successfully' }
                }
            } else {
                    return {message:'subAdmin Already exite'}
            }
        }

    } catch (error) {
        return error
    }
}



// geting subadmin data list here 
const subAdminGetTo = async (searchValue, pageNumbers, perPage = 20) => {
    try {

        console.log(pageNumbers * perPage ,'call the api ');

        let exiteAdminResult;
        let exiteDataLength;

        if (searchValue !== '' || pageNumbers >= 0) {
            const skipCount = pageNumbers * perPage;
            console.log(skipCount,'check skip coount');
            const query = {
                $or: [{ subAdmin: searchValue }, { uniqueId: searchValue }]
            };

            // Execute the main query
            const subAdminQueryValue = await Admin.find().skip(skipCount).limit(perPage);
            const subAdminSearchValue = await Admin.find(query);
            const totalLength = await Admin.countDocuments();
            exiteAdminResult = subAdminSearchValue.length < 1 ? subAdminQueryValue : subAdminSearchValue;
            exiteDataLength = totalLength / 20 < 1 ? 1 : Math.floor(totalLength);

            const subAdminUser = exiteAdminResult.filter((item) => item.role === 'subAdmin');
            console.log(subAdminUser);
          return { message: 'Successfully getting data', subAdminUser, exiteDataLength };
        }

        
    } catch (error) {
        // Handle errors gracefully
        console.error('Error in subAdminGetTo:', error);
        throw new Error('Failed to get data');
    }
};





module.exports = { insertSubAdmin, subAdminGetTo }