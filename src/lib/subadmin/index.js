import exiteUser from "../../middlewares/exiteUser.js";
import {Admin} from "../../models/admin.js";

// insert data to databse 
const insertSubAdmin = async (subAdminInfo) => {
    try {
        // object validation subadmininfo
        if (Object.keys(subAdminInfo).length === 0) {
            return { message: 'please provide correct data' }
        } else {
            const isValidation = Object.values(subAdminInfo).every(item => item);
            if (!isValidation) {
                return { message: 'Input value is missing' }
            }
        }

         // Check if the user already exists
        const exiteUserName = await exiteUser(subAdminInfo.subAdmin); // Await the exiteUser function
        if (exiteUserName.exists) {
                return { message: 'User already registered' };
         }

        
        // insert data to database 
        if (subAdminInfo) {
    
            const isExite = await Admin.findOne({ subAdmin: subAdminInfo.subAdmin, uniqueId: subAdminInfo.uniqueId }) // check the validation 

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
        if (error.code === '11000') return { message: 'Phone Number allredy  exite', error };
    }
}



// geting subadmin data list here 
const subAdminGetTo = async (searchValue, pageNumbers, perPage = 20) => {
    try {

       

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
         
          return { message: 'Successfully getting data', subAdminUser, exiteDataLength };
        }
    } catch (error) {
        // Handle errors gracefully
        console.error('Error in subAdminGetTo:', error);
        throw new Error('Failed to get data');
    }
};

// geting update the subAdmin info list

const updateSubAdminInfo = async (id, subadmininfo) => {
    try {
        
        // Find user by ID and update their information
        const updatedUser = await Admin.findByIdAndUpdate(
            id, 
            subadmininfo, 
            { new: true, runValidators: true } 
        );

        // Check if the update was successful
        if (updatedUser) {
            return { message: "Successfully updated the user", updated: true };
        } else {
            return { message: "User not found or update failed", updated: false };
        }
    } catch (error) {
        // Return a detailed error message
        return { message: "An error occurred while updating the user", error: error.message, updated: false };
    }
};

export { insertSubAdmin, subAdminGetTo, updateSubAdminInfo };