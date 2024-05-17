const Transaction = require("../../../models/transaction");


const insertTransaction = async (transInfo) => {
    try {
        // Check if transInfo is provided and has required fields
        if (!transInfo || !transInfo.transactionType || !transInfo.amount || !transInfo.number || !transInfo.authorId) {
            return { message: "Please provide correct data with required fields: transactionType, amount, number, authorId" };
        }

        // Delete unnecessary fields for 'withdraw' transactions
        if (transInfo.transactionType === 'withdraw') {
            delete transInfo.paymentMethod;
            delete transInfo.paymentChannel;
            delete transInfo.transactionId;
        }
        // Check if transaction with the same ID already exists
        if (transInfo.transactionType === 'deposite') {
            const isExistDataCheck = await Transaction.findOne({ transactionId: transInfo.transactionId });
            console.log("Existing transaction:", isExistDataCheck);
    
            if (isExistDataCheck) {
                return { message: "Transaction already exists" };
            }
        }

        // Create and save the transaction
        const insertedTransaction = await Transaction.create(transInfo);
        console.log("Inserted transaction:", insertedTransaction);

        if (insertedTransaction) {
            return { message: "Transaction inserted successfully" };
        }
    } catch (error) {
        console.error("Error inserting transaction:", error);
        return { message: "An error occurred while inserting transaction" };
    }
};



module.exports = { insertTransaction };

