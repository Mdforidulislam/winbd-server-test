const Transactions = require("../../../models/transactions");



// geting deposite data with query 
const transactionRequestDeposite = async (authorId) => {
    try { 
        if (authorId === '' || !authorId) {
            return { message: "please given authorId for query data" };
        }

        const matchAuthorData = await Transactions.find({ authorId: authorId });
        if (matchAuthorData) {
            const queryDepositeData = matchAuthorData.filter((item) => item.transactionType === 'deposite' && item.requestStatus === 'Processing').map(item => ({
                _id: item._id,
                userName: item.userName,
                transactionId: item.transactionId,
                amount: item.amount,
                number: item.number,
                paymentMethod: item.paymentMethod,
                transactionType: item.transactionType,
                paymentChannel: item.paymentChannel,
                TimeDay: formatTime(item.createdAt),
                stutusNote: item.stutusNote,
            }))
            return { message: "successfully geting payment Request Infomation", queryDepositeData };
        } else {
            return { message: "No payment method request insdie the database " };
        }

    } catch (error) { return error };
}


// geting withdraw payment request

const transactionRequestWithdraw = async (authorId) => {
    try { 
        if (authorId === '' || !authorId) {
            return { message: "please given authorId for query data" };
        }
        const matchAuthorData = await Transactions.find({ authorId: authorId });
    
        if (matchAuthorData) {
            const queryWithDrawData = matchAuthorData.filter((item) => item.transactionType === 'withdraw' && item.requestStatus === 'Processing').map(item => ({
                _id: item._id,
                userName: item.userName,
                transactionType: item.transactionType,
                amount: item.amount,
                number: item.number,
                paymentMethod: item.paymentMethod,
                todayTime: formatTime(item.createdAt),
                paymentChannel: item.paymentChannel,
                TimeDay: formatTime(item.createdAt),
                stutusNote: item.stutusNote,
            }));
            return { message: "successfully geting payment Request Infomation", queryWithDrawData };
            
        } else {
            return { message: "No payment method request insdie the database " };
        }

    } catch (error) { return error };
}

// geting veryfied transaction data here

const verifyTransactionData = async (authoreId) => {
    try {

        if (authoreId === '') {
            return { message: "please provide valid authoredId" };
        }

        const verifyTransactionDat = await Transactions.find({ authorId: authoreId }).lean();
        if (verifyTransactionDat) {
            const queryVerifyData = verifyTransactionDat.filter((item) =>  item.requestStatus === 'verify').map(item => ({
                _id: item._id,
                userName: item.userName,
                transactionType: item.transactionType,
                amount: item.amount,
                number: item.number,
                paymentMethod: item.paymentMethod,
                todayTime: formatTime(item.createdAt),
                paymentChannel: item.paymentChannel,
                TimeDay: formatTime(item.createdAt),
                stutusNote: item.stutusNote,
            }));
            return { message: "successfully geting payment Request Infomation", queryVerifyData };
            
        } else {
            return { message: "No payment method request insdie the database " };
        }

        } catch (error) {
            return error;
        }
};


// transaction request feedback

const transactionRestFeedback = async (id, requestStatus,note = 'waiting for response') => {
    try {
        if (!id || !requestStatus) {
            return { message: "Please provide valid id and status data for the change request" };
        }
        const updateFields = {};
        if (['Approved', 'verify', 'Rejected'].includes(requestStatus)) {
            updateFields.requestStatus = requestStatus;
            updateFields.stutusNote = note;
        } else {
            updateFields.transactionId = requestStatus;
            updateFields.requestStatus = 'payment';
            updateFields.stutusNote = note;
        }

        const updatedTransaction = await Transactions.findOneAndUpdate(
            { _id: id },
            updateFields,
            { new: true }
        );

        if (!updatedTransaction) {
            return { message: 'Transaction not found' };
        }

        const responseMessage = updateFields.requestStatus
            ? 'Request status updated successfully'
            : 'Transaction ID updated successfully';

        return { message: responseMessage };

    } catch (error) {
        return { error: error.message };
    }
};

const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedTime = new Date(date).toLocaleTimeString('en-US', options);
    const [time, period] = formattedTime.split(' ');
    return time.replace(':', '.') + ' ' + period;
};


module.exports = { transactionRequestDeposite, transactionRequestWithdraw , transactionRestFeedback ,verifyTransactionData };
