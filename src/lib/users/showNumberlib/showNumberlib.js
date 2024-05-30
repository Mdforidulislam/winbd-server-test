const { PaymentMethodActive } = require("../../../models/paymentMethod");
const Transactions = require("../../../models/transactions");
const { UserList } = require("../../../models/users");

const showNumberlib = async (author, method, userName) => {
    try {
        // Validate input parameters
        if (!author || !method || !userName) {
            return { message: "Please provide valid author, method, and userName" };
        }

        // Find payment methods matching authorId and transactionMethod
        const existingPaymentMethods = await PaymentMethodActive.find({$and:[{authorId: author},{transactionMethod: method }]}).select('number depositeChannel transactionMethod status note');

        const exiteUser = await UserList.findOne({ userName: userName }); // Getting user's number 
        
        // Find processing transactions for the given userName
        const processingTransactions = await Transactions.find({ userName: userName, requestStatus: 'Processing' });

        // Check if there are any processing transactions
        let processingMessage = null;
        let isProcessing;
        processingTransactions.forEach(item => {
            if (item.transactionType === 'deposite') {
                processingMessage = "দয়া করে লক্ষ্য দিন: আপনার প্রেরিত ডিপোজিট অনুরোধটি এখনো প্রোসেসিং অবস্থায় রয়েছে। অনুগ্রহ করে পূর্বের অনুরোধটি সম্পন্ন হওয়ার পরে নতুন অনুরোধ প্রেরণ করুন। ধন্যবাদ!";
                isProcessing = "deposite";
            } else if (item.transactionType === 'withdraw') {
                processingMessage = "দয়া করে লক্ষ্য দিন: আপনার প্রেরিত উইথড্রো অনুরোধটি এখনো প্রোসেসিং অবস্থায় রয়েছে। অনুগ্রহ করে পূর্বের অনুরোধটি সম্পন্ন হওয়ার পরে নতুন অনুরোধ প্রেরণ করুন। ধন্যবাদ!";
                isProcessing = "withdraw";
            }
        });

        // Check if any of the existing payment methods are active
        const isActive = existingPaymentMethods.some(method => method.status === 'active');

        if (existingPaymentMethods.length > 0) {
            if (isActive) {
                // Return existing payment methods and processing status
                return {
                    message: "Successfully retrieved data",
                    paymentMethods: existingPaymentMethods,
                    processingMessage: processingMessage,
                    userPhoneNumber: exiteUser.phoneNumber,
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
