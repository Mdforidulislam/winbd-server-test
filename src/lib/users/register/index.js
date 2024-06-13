const exiteUser = require("../../../middlewares/exiteUser");
const { UserList } = require("../../../models/users");



// insert data to databse 
const insertUserToDatabase = async(userInfo) =>{
    try{
       // object validation list here 
        if(Object.keys(userInfo).length === 0 || !Object.values(userInfo).every(item => item)){
            return { message: 'users data missing filed' };
        }

        // Check if the user already exists
        const exiteUserName = await exiteUser(userInfo.userName); // Await the exiteUser function
        console.log(exiteUserName);
        
        if (exiteUserName.exists) {
            return { message: 'User already registered' };
        }

        // insert data to databse 
        const userExite = await UserList.findOne({ $or: [{ userName: userInfo.userName }] })
        if (userExite) {
            return { message: "user Already register" };
        }
        const insertData = await UserList.create(userInfo); insertData.save(); // save the to database 
        // send a message to dabase 
        if(insertData){
            return { message: 'data insert Successfully to database' };
        }else{
            return { message: 'somthing wrong here' };
        }

    }catch(error){
        if(error.code === '11000'){
            return { message: "number allready or userName already exite to database", error };
        }
    }
}




// geting register user data fromt database 
const getingRegUser = async (userName) => {
    
    try {
        if (userName === '' || !userName) {
            return { message: 'Please provide correct data' }
        }

        // geting data to database 
        const getingUser = await UserList.findOne({ userName: userName });
        if (getingUser) {
            // send data to database 
            return { message: 'user geting successfully', userName: getingUser?.userName, phoneNumber: getingUser?.phoneNumber };
        } else {
            return { message: "users do't exite inside the database " }
        }

    } catch (error) {
        return error;
    }
};

// geting update the userInfo list

const updateUserInfo = async (id, userInfo) => {
    try {

        // Find user by ID and update their information
        const updatedUser = await UserList.findByIdAndUpdate(
            id, // ID of the user to update
            userInfo, // The user information to update
            { new: true, runValidators: true } // Options to return the updated document and run validation
        );

        // Check if the update was successful
        if (updatedUser) {
            return { message: "Successfully updated the user", updated: true, };
        } else {
            return { message: "User not found or update failed", updated: false };
        }
    } catch (error) {
        // Return a detailed error message
        return error;
    }
};



module.exports = {insertUserToDatabase, getingRegUser,updateUserInfo};