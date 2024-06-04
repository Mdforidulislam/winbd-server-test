const { PaymentMethodActive } = require("../../../models/paymentMethod");
const Transactions = require("../../../models/transactions");
const { UserList } = require("../../../models/users");

const showNumberlib = async (author, userName) => {
    try {
        // Validate input parameters
        if (!author || !userName) {
            return { message: "Please provide valid author, method, and userName" };
        }

        // Find payment methods matching authorId and transactionMethod
        const existingPaymentMethods = await PaymentMethodActive.find({ authorId: author})
            .select('number depositeChannel transactionMethod status note')
            .lean();

        // Getting user's number
        const exiteUser = await UserList.findOne({ userName: userName }, { phoneNumber: 1 }).lean();

        // Find processing transactions for the given userName
        const processingTransactions = await Transactions.find({ userName: userName, requestStatus: 'Processing' })
            .select('transactionType')
            .lean();

        // Check if any of the existing payment methods are active
        const isActive = existingPaymentMethods.some(method => method.status === 'active');

        let processingMessage;
        let isProcessing;

        // Check if there are any processing transactions
        processingTransactions.forEach(item => {
            if (item.transactionType === 'deposite') {
                processingMessage = "Your deposit request is still processing. Please wait for the previous request to complete before sending a new one. Thank you!";
                isProcessing = "deposite";
            } else if (item.transactionType === 'withdraw') {
                processingMessage = "Your withdrawal request is still processing. Please wait for the previous request to complete before sending a new one. Thank you!";
                isProcessing = "withdraw";
            }
        });

        if (existingPaymentMethods.length > 0) {
            if (isActive) {
                // Return existing payment methods and processing status
                return {
                    message: "Successfully retrieved data",
                    paymentMethods: existingPaymentMethods,
                    processingMessage: processingMessage,
                    userPhoneNumber: exiteUser?.phoneNumber, // Use optional chaining to avoid errors if exiteUser is null
                    isProcessing
                };
            } else {
                return { message: "No active payment methods found", processingMessage: processingMessage };
            }
        } else {
            return { message: "Payment methods not found", processingMessage: processingMessage };
        }

    } catch (error) {
        return { error: "An error occurred while fetching payment methods", details: error.message };
    }
}

module.exports = { showNumberlib };
