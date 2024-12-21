import {PaymentInstraction} from "../../models/intstractions.js";

// insert data to database 
const insertPaymentInstruction = async (payInstruction) => {
    try {
        // Validate input
        if (!payInstruction || Object.keys(payInstruction).length === 0) {
            return { message: "Please provide valid data", status: "error" };
        }

        // Check for existing data with the same startTitle and endTitle
        const isExistingData = await PaymentInstruction.findOne({
            startTitle: payInstruction.startTitle,
            endTitle: payInstruction.endTitle
        });

        if (isExistingData) {
            return { message: 'Data already exists in the database', status: "error" };
        }

        // Create and save the payment instruction
        const newPaymentInstruction = new PaymentInstruction(payInstruction);
        const savedPaymentInstruction = await newPaymentInstruction.save();

        return { message: 'Successfully inserted data', status: "success", data: savedPaymentInstruction };
    } catch (error) {
        console.error("Error inserting payment instruction:", error);
        return { message: 'Something went wrong', status: "error", error };
    }
};

// geting data instrucation 
const getPaymentInstructions = async (channeltype) => {
    try {
        const paymentInstructions = await PaymentInstruction.find();
        if (paymentInstructions.length > 0) {
            return { message: "Successfully retrieved results", status: "success", data: paymentInstructions };
        } else {
            return { message: "No payment instructions found", status: "info" };
        }
    } catch (error) {
        console.error("Error retrieving payment instructions:", error);
        return { message: 'Something went wrong', status: "error", error };
    }
};

export { getPaymentInstructions, insertPaymentInstruction };
