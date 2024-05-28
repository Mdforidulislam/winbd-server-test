const { PaymentMethodDeafult, PaymentMethodActive } = require("../../../models/paymentMethod");

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

const getingPaymentMethod = async (authorId , paymentType , activeId) => {
    try {
        // Fetch data from the database
        const paymentMethods = await PaymentMethodDeafult.find({depositeChannel: paymentType}).lean();
        const activeMethods = await PaymentMethodActive.find({$and:[{authorId: authorId},{depositeChannel: paymentType}] }).lean();

        // Filter out active payment methods
        const filteredMethods = paymentMethods.filter(item => !activeId.includes(item._id.toString()));
        const combinedMethods = [...filteredMethods, ...activeMethods].map((item) => ({
            id: item._id,
            number: item.number,
            depositeChannel: item.depositeChannel,
            transactionMethod: item.transactionMethod,
            note: item.note,
            status: item.status,
            Logo: item.Logo,
        }));
        return combinedMethods;
    } catch (error) {
        return { error: error.message || "An error occurred while fetching payment methods" };
    }
};


// Update or insert a payment method
const updatePaymentmethod = async (updateInfo) => {
    try {
        if (!updateInfo || Object.keys(updateInfo).length === 0) {
            return { message: "Please provide valid data" };
        }

        // Check if the record exists based on the given criteria
        const query = {
            authorId: updateInfo.authorId,
            number: updateInfo.number,
            depositeChannel: updateInfo.depositeChannel,
            transactionMethod: updateInfo.transactionMethod,
        };

        // If the record exists, update it; otherwise, insert a new record
        const updatedData = await PaymentMethodActive.findOneAndUpdate(query, updateInfo, { new: true, upsert: true });

        return {
            message: "Successfully processed payment method",
            data: updatedData
        };
    } catch (error) {
        return { error: error.message || "An error occurred while updating payment method" };
    }
};



module.exports = { addTransactionMethod, getingPaymentMethod , updatePaymentmethod };