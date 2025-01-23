import exiteUser from "../../middlewares/exiteUser.js";
import {Admin} from "../../models/admin.js";

// insert data to database 
const adminInsertList = async (adminInfo) => {
    try {
        // object validation 
        if (Object.keys(adminInfo).length === 0) {
            return { message: 'Please provide correct data or valid data ' };
        }

        // keys validation 
        for (let key in adminInfo) {
            if (adminInfo.hasOwnProperty(key)) {
                if (adminInfo[key] === undefined) {
                    throw new Error(`value for filed ${key} is undefined`);
                }
            }
        }

        // check the userAlready Exite 
        exiteUser(adminInfo.subAdmin);

        // save to database 
        const insertData = await Admin.create(adminInfo);
        insertData.save();

        // return message here       
        if (Object.keys(insertData).length === 0) {
            return { message: "user don't insert to database , somthink wrong" };
        } else {
            return { message: "successfully data insert to database " };
        }

    } catch (error) { return error; }
}

// geting data to database 
const getingAdminData = async (adminInfo) => {
    try {
     
        // object  value is missing validation
        if (Object.keys(adminInfo).length === 0) {
            return { message: "please provide required data" };
        }

        // filed value is missing validation 
        for (let key in adminInfo) {
            if (adminInfo.hasOwnProperty(key)) {
                if (adminInfo[key] === undefined) {
                    return { message: 'fild value is missing ' };
                }
            }
        }

      
        // geting data to database 
        const getingAdmin = await Admin.findOne();
       
        // check the data , validation 
        if (getingAdmin && Object.values(getingAdmin).length > 0) {
            return { message: 'welcome admin role', name: getingAdmin.adminName, phoneNumber: getingAdmin.phoneNumber };
        }
    } catch (error) {
        return error;
    }
}


const singleSubAdmin = async (uniqueId) => {
    if (!uniqueId) throw new Error("ID is required to fetch the sub-admin");
    try {
      const response = await Admin.findOne({
        uniqueId
      });
      if (!response) throw new Error("Sub-admin not found");
      return response;
    } catch (error) {
      throw new Error(`Error fetching sub-admin: ${error.message}`);
    }
  }

// Helper function to update the payment method in the database
const updatePaymentMethod = async (id, type) => {
    console.log(id,type)
    try {

       const admin = await Admin.findById(id);

       if (!admin) {
         throw new Error("Admin not found.");
       }
   
       console.log(admin)
       // Find the payment permission for the specified type
       const permission = admin.paymentPermissions.find((p) => p.type === type);
   
       if (!permission) {
         throw new Error(`Payment type '${paymentType}' not found.`);
       }
   
       // Toggle the `allowed` value
       const newAllowedValue = !permission.allowed;
   
       // Update the document with the toggled value
       const updatedAdmin = await Admin.findByIdAndUpdate(
         id,
         {
           $set: {
             "paymentPermissions.$[elem].allowed": newAllowedValue,
           },
         },
         {
           arrayFilters: [{ "elem.type": type }], // Match the specific type
           new: true, // Return the updated document
         }
       );
   
       return updatedAdmin;


    } catch (error) {
      console.error("Error in updatePaymentMethod:", error.message);
      throw error;
    }
  };
  

export { adminInsertList, getingAdminData ,updatePaymentMethod,singleSubAdmin};