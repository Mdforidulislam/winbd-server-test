const { insertUserToDatabase, getingRegUser, updateUserInfo } = require("../../lib/users/register");


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
        console.log(username, req.query);
        const resutl = await getingRegUser(username); // call the function for geting user data list 
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
        const finalResult = await updateUserInfo(id, userInfo); // call the libray funtion for updatate userinfo 
        res.status(200).json(finalResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { userInsert, getingUsersData, updateUserInfoAPI };