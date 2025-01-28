// const { insertUserToDatabase, getingRegUser, updateUserInfo } = require("../../lib/users/register");

import { insertUserToDatabase, getingRegUser, updateUserInfo } from "../../lib/users/register/index.js";


// users data insert here 
const userInsert = async(req,res)=>{
    try {
        const userInfoList = req.body;
        // innsert data to lib list 
        const result = await insertUserToDatabase(userInfoList)
        res.status(200).json(result)

    }catch(error){
        res.status(500).json({error: error.message})
    }
}

// getingUsersDataList  here

const getingUsersData = async (req, res) => {
    try {
        const username = req.query.userName;
  
        const resutl = await getingRegUser(username); 
        res.status(200).json(resutl)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

// udpate the data from users

const updateUserInfoAPI = async (req, res) => {
    try { 
        const id  = req.query.id;
        const  userInfo  = req.body;
        if (!id || !Object.values(userInfo).every(item => item)) {
            message: "userInfo or Id missing";
        };
        
        const finalResult = await updateUserInfo(id, userInfo); 
        res.status(200).json(finalResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export  { userInsert, getingUsersData, updateUserInfoAPI };