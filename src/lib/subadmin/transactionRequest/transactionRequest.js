const PromotionOffersSave = require("../../../models/promotionsave");
const Transactions = require("../../../models/transactions");



const formatTime = (date) => {
    // Create options object for formatting time
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Dhaka'
    };

    // Format the date to a time string based on the Bangladesh timezone
    const formattedTime = new Date(date).toLocaleTimeString('en-US', options);

    // Split the formatted time into time and period (AM/PM)
    const [time, period] = formattedTime.split(' ');

    return time.replace(':', '.') + ' ' + period;
};
//  time formate here 

const formatDate = (date) => {
    const options = { day: '2-digit', month: 'numeric', year: 'numeric', timeZone: 'Asia/Dhaka' };
    return new Date(date).toLocaleDateString('en-US', options);
};

//  transaction request deposite
const transactionRequestDeposite = async (authorId) => {
    try {
        if (!authorId) {
            return { message: "Please provide an authorId for querying data." };
        }

        const matchAuthorData = await Transactions.find({ authorId });
        if (!matchAuthorData || matchAuthorData.length === 0) {
            return { message: "No payment method request inside the database." };
        }

        // Fetch old turnover records
        const oldTurnover = await PromotionOffersSave.find({ authorId: authorId })
        .select('_id turnover offerAmount title')
        .lean();
    
        // Pop the most recent turnover record
        const newTurnover = oldTurnover.pop();
        const offerAmount = newTurnover ? newTurnover.offerAmount : 0;
        
        // Filter and map the deposit data with "Processing" status
        const queryDepositeData = matchAuthorData
            .filter(item => item.transactionType === 'deposite' && item.requestStatus === 'Processing')
            .map(item => {

                const totalAmount = item.amount + offerAmount;

                return {
                    _id: item._id,
                    userName: item.userName,
                    transactionId: item.transactionId,
                    amount: item.amount,
                    userNumber: item.userNumber,
                    authoreNumber: item.authoreNumber,
                    paymentMethod: item.paymentMethod,
                    transactionType: item.transactionType,
                    paymentChannel: item.paymentChannel,
                    TimeDay: formatTime(item.createdAt),
                    statusNote: item.statusNote,
                    transactionImage: item.transactionImage,
                    offerAmount,
                    totalAmount

                };
            });

        // Check if there are any processing deposit transactions
        const isDepositeProcessing = queryDepositeData.length > 0;

        if (isDepositeProcessing) {

            return {
                message: "Successfully retrieved payment request information",
                queryDepositeData,
                oldTurnover,
                newTurnover
            };
        }
    } catch (error) {
        console.error("Error retrieving deposit data:", error);
        return { message: "An error occurred while retrieving deposit data.", error };
    }
};


// geting withdraw payment request

const transactionRequestWithdraw = async (authorId) => {
    try {
        if (!authorId) {
            return { message: "Please provide an authorId for querying data." };
        }

        const matchAuthorData = await Transactions.find({ authorId });

        if (!matchAuthorData || matchAuthorData.length === 0) {
            return { message: "No payment method request inside the database." };
        }

        // Filter for withdraw transactions with "Processing" status
        const queryWithDrawData = matchAuthorData
            .filter(item => item.transactionType === 'withdraw' && item.requestStatus === 'Processing')
            .map(item => {
                return {
                    _id: item._id,
                    userName: item.userName,
                    transactionType: item.transactionType,
                    amount: item.amount,
                    userNumber: item.userNumber,
                    authoreNumber: item.authoreNumber,
                    paymentMethod: item.paymentMethod,
                    paymentChannel: item.paymentChannel,
                    todayTime: formatTime(item.createdAt),
                    TimeDay: formatDate(item.createdAt),
                    statusNote: item.statusNote,
                };
            });

        // Fetch old turnover records
        const turnoverList = await PromotionOffersSave.find({ authorId: authorId })
        .select('_id turnover offerAmount title')
        .lean();
    
        // Calculate the total turnover amount
        const totalTurnover = turnoverList.reduce((acc, item) => acc + item.turnover, 0);

        // Return the response with withdraw data and turnover information
        if (queryWithDrawData.length > 0) {
            return {
                message: "Successfully retrieved payment request information",
                queryWithDrawData,
                totalTurnover,
                turnoverList
            };
        }


    } catch (error) {
        console.error("Error retrieving withdraw data:", error);
        return { message: "An error occurred while retrieving withdraw data.", error };
    }
};

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
                userName: item?.userName,
                transactionType: item?.transactionType,
                amount: item?.amount,
                userNumber: item.userNumber,
                authoreNumber: item.authoreNumber,
                paymentMethod: item?.paymentMethod,
                todayTime: formatTime(item.createdAt),
                paymentChannel: item.paymentChannel,
                TimeDay: formatTime(item.createdAt),
                requestStatus: item?.requestStatus,
                transactionId: item?.transactionId,
                transactionImage: item.transactionImage,
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

const transactionRestFeedback = async (id, requestStatus, note = 'waiting for response',transactionId) => {
    try {
      if (!id || !requestStatus) {
        return { message: "Please provide valid id and status data for the change request" };
      }
  
      const updateFields = {};
      let responseMessage = '';
  
      if (['Approved', 'verify', 'Rejected'].includes(requestStatus)) {
        updateFields.requestStatus = requestStatus;
        updateFields.statusNote = note;
        responseMessage = 'Request status updated successfully';
      } else {
        updateFields.transactionId = transactionId;
        updateFields.requestStatus = requestStatus;
        updateFields.statusNote = note;
        responseMessage = 'Transaction ID updated successfully';
      }
  
      const updatedTransaction = await Transactions.findOneAndUpdate(
        { _id: id },
        updateFields,
        { new: true }
      );
  
      if (!updatedTransaction) {
        return { message: 'Transaction not found' };
      }
  
      return { message: responseMessage };
  
    } catch (error) {
      return { error: error.message };
    }
  };


module.exports = { transactionRequestDeposite, transactionRequestWithdraw , transactionRestFeedback ,verifyTransactionData };
