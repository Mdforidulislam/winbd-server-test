import { PaymentMethodActive } from "../../../models/paymentMethod.js";
import { Transactions } from "../../../models/transactions.js";
import { UserList } from "../../../models/users.js";


const showNumberlib = async (author, userName) => {
    try {

        // Validate input parameters
        if (!author || !userName) {
            return { message: "Please provide valid author and userName" };
        }

        // Fetch active payment methods for the author
        const activePaymentMethods = await PaymentMethodActive.find({ authorId: author, status: 'active' })
            .select('number depositeChannel transactionMethod status note activePayMethod')
            .lean();
        // Get the user's phone number
        const user = await UserList.findOne({ userName: userName }, { phoneNumber: 1 }).lean();

        // Fetch processing transactions for the user
        const processingTransactions = await Transactions.find({ userName: userName, requestStatus: 'Processing' })
            .select('transactionType')
            .lean();

        // Determine processing message and status
        let processingMessage = null;
        let isProcessing = null;

        processingTransactions.forEach(transaction => {
            if (transaction.transactionType === 'deposite') {
                processingMessage = "Your deposit request is still processing. Please wait for the previous request to complete before sending a new one. Thank you!";
                isProcessing = "deposite";
            } else if (transaction.transactionType === 'withdraw') {
                processingMessage = "Your withdrawal request is still processing. Please wait for the previous request to complete before sending a new one. Thank you!";
                isProcessing = "withdraw";
            }
        });


   
        // Check if there are active payment methods
        if (activePaymentMethods.length > 0) {
            return {
                message: "Successfully retrieved data",
                paymentMethods: activePaymentMethods,
                processingMessage,
                userPhoneNumber: user?.phoneNumber,
                isProcessing
            };
        } else {
            return {
                message: "No active payment methods found",
                processingMessage,
                userPhoneNumber: user?.phoneNumber
            };
        }

    } catch (error) {
        return { error: "An error occurred while fetching payment methods", details: error.message };
    }
};

export { showNumberlib };
