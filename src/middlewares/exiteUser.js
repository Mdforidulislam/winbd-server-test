const Admin = require("../models/admin");
const { UserList } = require("../models/users");


    const exiteUser = async (userName) => {
            try { 
                console.log('call api');
                const isExiteUser = await UserList.findOne({ userName: userName }); // check if the user exists
                const isExiteAdmin = await Admin.findOne({ subAdmin: userName }); // check if the admin exists
        
                if (isExiteUser || isExiteAdmin) {
                    return { exists: true, message: "User already registered" };
                }
                return { exists: false, message: "please register sucessfully" };
            } catch (error) {
                return { exists: false, message: error.message };
            }
    };


module.exports = exiteUser;