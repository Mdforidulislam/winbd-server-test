import { adminInsertList, getingAdminData, updatePaymentMethod } from './../../lib/admin/index.js';

// insert data to database
const adminInsertData = async (req, res) => {
    try {
        const adminData = {
            uniqueId: '2024',
            subAdmin: 'shawon',
            phoneNumber: '01614170358',
            password: 'adminShawon',
            role: 'admin'
        };
        const allAdminInfo = req.body;
        const result = await adminInsertList(adminData);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// geting data from the database 
const getAdminInfoList = async (req, res) => {
    try {
        const adminInfo = { adminName: 'John Doe', password: 'password123' };
        const result = await getingAdminData(adminInfo);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePaymentInfo = async (req, res) => {
    try {
      // Extract the necessary data from the request
      const {id,type} = req.query; 

      if (!id || !type) {
        return res.status(400).json({
          message: "Invalid input: 'id' and 'payment' are required.",
          status: 400,
        });
      }
  
      // Call the helper function to update the payment method
      const updatedResponse = await updatePaymentMethod(id,type);
  
      // Check if the update was successful
      if (!updatedResponse) {
        return res.status(404).json({
          message: "Payment method not found or could not be updated.",
          status: 404,
        });
      }
  
      // Return success response
      return res.status(200).json({
        message: "Successfully updated the payment information.",
        status: 200,
        result: updatedResponse,
      });
    } catch (error) {
      console.error("Error updating payment info:", error.message);
  
      // Handle unexpected server errors
      return res.status(500).json({
        message: "An error occurred while updating payment information.",
        status: 500,
        error: error.message,
      });
    }
  };


export { adminInsertData, getAdminInfoList ,updatePaymentInfo};