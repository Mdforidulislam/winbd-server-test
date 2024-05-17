const { UserList } = require("../../../models/users");



// insert data to databse 
const insertUserToDatabase = async(userInfo) =>{
    try{
       // object validation list here 
        if(Object.keys(userInfo).length === 0 || !Object.values(userInfo).every(item => item)){
            return {message:'users data missing filed'}
        }
        // insert data to databse 
        const userExite = await UserList.findOne({ $or: [{ userName: userInfo.userName }] })
        if (userExite) {
            return {message: "user Already register"}
        }
        const insertData = await UserList.create(userInfo); insertData.save(); // save the to database 
        // send a message to dabase 
        if(insertData){
            return {message:'data insert Successfully to database'}
        }else{
            return {message:'somthing wrong here'}
        }

    }catch(error){
        return error;
    }
}




// geting register user data fromt database 
const getingRegUser = async (userName) => {
    
    try{
        if(userName === '' || !userName){
            return {message:'Please provide correct data'}
        }
        // geting data to database 
        const getingUser = await UserList.findOne({ userName: userName }); 
        if(getingUser){
        // send data to database 
            return{message:'user geting successfully', userName: getingUser?.userName, phoneNumber: getingUser?.phoneNumber};
        }else {
            return {message: "users do't exite inside the database "}
        }

    }catch(error){
        return error;
    }
}


module.exports = {insertUserToDatabase, getingRegUser};