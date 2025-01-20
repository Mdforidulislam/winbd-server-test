import { PaymentMethodDeafult, PaymentMethodActive } from "../../../models/paymentMethod.js";

// Insert a payment method
const addTransactionMethod = async (paymentInfo) => {
    try {
        const insertedData = await PaymentMethodDeafult.create(paymentInfo);
        return { message: 'Successfully inserted' };
    } catch (error) {
        return { error: error.message || "An error occurred while inserting payment method" };
    }
};


// Fetch payment methods
// Function to fetch and combine payment methods
const getingPaymentMethod = async (authorId, paymentType) => {
    try {
        // Fetch default and active payment methods from the database
        const [defaultMethods, activeMethods] = await Promise.all([
            PaymentMethodDeafult.find({ depositeChannel: paymentType }).lean(),
            PaymentMethodActive.find({ authorId, depositeChannel: paymentType }).lean()
        ]);

        // Create a Set of active method ID numbers for quick lookup
        const activeMethodIdNumbers = new Set(activeMethods.map(method => method.idNumber));

        // Filter out default methods that are also active
        const filteredMethods = defaultMethods.filter(method => !activeMethodIdNumbers.has(method.idNumber));

        // Combine the filtered default methods with the active methods
        const combinedMethods = [...filteredMethods, ...activeMethods].map(method => ({
            id: method._id,
            number: method.number,
            depositeChannel: method.depositeChannel,
            transactionMethod: method.transactionMethod,
            note: method.note,
            status: method.status,
            Logo: method.Logo, // Ensure consistent key naming (lowercase 'logo')
            idNumber: method.idNumber,
            note: method.note,
            activePayMethod: method.activePayMethod
        }));

        return combinedMethods;
    } catch (error) {
        console.error("Error fetching payment methods:", error);
        return { error: error.message || "An error occurred while fetching payment methods" };
    }
};



// Update or insert a payment method
const updatePaymentmethod = async (updateInfo) => {
    try {
        console.log(updateInfo);
        if (!updateInfo || Object.keys(updateInfo).length === 0) {
            return { message: "Please provide valid data" };
        }

        // Check if the record exists based on the given criteria
        const query = {
            authorId: updateInfo.authorId,
            idNumber: updateInfo.idNumber
        };

        // Update the record if it exists, or insert a new one if it doesn't
        const updatedData = await PaymentMethodActive.findOneAndUpdate(
            query,
            updateInfo,
            { new: true, upsert: true }
        );

        return {
            message: "Successfully processed payment method",
            data: updatedData
        };

    } catch (error) {
        return { error: error.message || "An error occurred while updating payment method" };
    }
};


const updatePermissionPaymentDB = async (id, type) => {
    try {
      // Fetch the document by ID
      const result = await PaymentMethodActive.findById(id);
  
      // Check if the result exists
      if (!result) {
        throw new Error("Document not found");
      }

      console.log(result)
      console.log(typeof result.note === 'string' )
      console.log( typeof result.note)
      console.log(result.note === "" )
      console.log(result.note )

      if (typeof result.note === 'string' || result.note === null) {
        result.note = {
          title: '',
          list: [],
          remainder: ''
        };
      }

      // Update the `allowed` field for the element matching the `type`
      const updatedPayMethods = result.activePayMethod.map((method) => {
        return {
          ...method, 
          allowed: method.type === type ? !method.allowed : false
        };
      });
  

  

      // Log the updated pay methods
    //   console.log(updatedPayMethods);
  
      // You should update the `activePayMethod` in the document and save
      result.activePayMethod = updatedPayMethods;
      const updatedResult = await result.save();
  
      return updatedResult;
    } catch (error) {
      console.error("Error updating permission:", error.message);
      return error;
    }
  };
  
  
  
  

export { addTransactionMethod, getingPaymentMethod, updatePaymentmethod ,updatePermissionPaymentDB};