const Admin = require("../../models/admin");
const { UserList } = require("../../models/users");

// athuntication part  , athuntication the users
const adminUserValidation = async (req, res) => {
    try {
                const userName = req.query.userName;
                const password = req.query.password;
        // Object and field validation
        if (userName === '' || password === '') {
                return res.status(400).json({ message: 'Your field value is missing' });
        }
        //  data check if exite database 
                const isExitedAdmin = await Admin.findOne({$and:[{subAdmin:userName},{password:password}]});
                const isExiteUser = await UserList.findOne({ $and: [{ userName: userName }, { password: password }] });

        //  here are valiation all the users and admin
        if (isExitedAdmin) {
            if (isExitedAdmin?.role === 'admin') {
                return res.status(200).json({role:isExitedAdmin.role , uniqueId: isExitedAdmin?.uniqueId });
            } else if (isExitedAdmin?.role === 'subAdmin') {
                return res.status(200).json({ role:isExitedAdmin.role , uniqueId: isExitedAdmin?.uniqueId });
            } else {
                return res.status(200).json({ message: "Don't Match adminName or password"});
            }

        } else if (isExiteUser?.role === 'user') {
                return res.status(200).json({ role: isExiteUser?.role , authorId: isExiteUser?.authorId });
        }
        else {
                return res.status(200).json({ message: "Don't Match userNmae or password" });
        }
    } catch (error) {
                return res.status(500).json({ error: error.message });
    }
}


module.exports = { adminUserValidation }