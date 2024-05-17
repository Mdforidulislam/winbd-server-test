const { adminInsertList, getingAdminData } = require("../../lib/admin");

// insert data to database
const adminInsertData =  async(req,res) =>{
    try{
        const adminData = {
            uniqueId:'20040',
            subAdmin: 'John Doe',
            phoneNumber: '1634567890',
            password: 'password123',
            role: 'admin'
        };
        const allAdminInfo = req.body;
        const result = await adminInsertList(adminData);
        res.status(200).json(result)
      
    }catch(error){ 
        res.status(500).json({error: error.message})
    }
}

// geting data from the database 
const getAdminInfoList = async(req,res)=>{
    try{
        const adminInfo = {adminName: 'John Doe',password: 'password123'};
        const result = await getingAdminData(adminInfo);
        res.status(200).json(result)

    }catch(error){
        res.status(500).json({error: error.message})
    }
}



module.exports = {adminInsertData, getAdminInfoList}