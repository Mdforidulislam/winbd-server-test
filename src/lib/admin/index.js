const Admin = require("../../models/admin")

// insert data to database 
const adminInsertList =  async(adminInfo) =>{
    try{
   
        // object validation 
        if (Object.keys(adminInfo).length === 0 ) {
            return {message: 'Please provide correct data or valid data '}
        }
        // keys validation 
        for(let key in adminInfo){
            if (adminInfo.hasOwnProperty(key)) {
                if (adminInfo[key] === undefined) {
                    throw new Error(`value for filed ${key} is undefined`)
                }
            }
        }
        // save to database 
        const insertData = await Admin.create(adminInfo)
              insertData.save()
        
        // return message here       
        
        if (Object.keys(insertData).length === 0 ) {
            return {message: "user don't insert to database , somthink wrong"}
        }else{
            return {message: "successfully data insert to database "}
        }

    }catch(error){ return error}
}




// geting data to database 
const getingAdminData = async(adminInfo)=>{
    try{
        console.log('call api');
        // object  value is missing validation
        if (Object.keys(adminInfo).length === 0 ) {
            return {message: "please provide required data"}
        }

        // filed value is missing validation 
        for(let key in adminInfo){
            if(adminInfo.hasOwnProperty(key)){
                if(adminInfo[key] === undefined){
                    return {message: 'fild value is missing '}
                    
                }
            }
        }

        console.log(adminInfo);
        // geting data to database 
        const getingAdmin = await Admin.findOne()
        console.log(getingAdmin);
        // check the data , validation 
        if(getingAdmin && Object.values(getingAdmin).length > 0){
            return {message: 'welcome admin role', name:getingAdmin.adminName, phoneNumber: getingAdmin.phoneNumber}
        }
    }catch(error){
        return error
    }
}







module.exports = {adminInsertList , getingAdminData}