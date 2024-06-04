const Transactions = require("../../../models/transactions");



const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedTime = new Date(date).toLocaleTimeString('en-US', options);
    const [time, period] = formattedTime.split(' ');
    return time.replace(':', '.') + ' ' + period;
};
const formatDate = (date) => {
    const options = { day: '2-digit', month: 'numeric', year: 'numeric', timeZone: 'Asia/Dhaka' };
    return new Date(date).toLocaleDateString('en-US', options);
};


// geting deposite data with query 
const transactionRequestDeposite = async (authorId) => {
    try {
        if (!authorId) {
            return { message: "Please provide an authorId for querying data." };
        }

        const matchAuthorData = await Transactions.find({ authorId });
        if (!matchAuthorData || matchAuthorData.length === 0) {
            return { message: "No payment method request inside the database." };
        }

        const queryDepositeData = matchAuthorData.filter(item => item.transactionType === 'deposite' && item.requestStatus === 'Processing').map(item => {
                const offer = item.offers[0];
                const oldTurnover = Array?.isArray(offer?.turnover) ? [...offer?.turnover] : [offer?.turnover];
                const newTurnover = oldTurnover?.pop(); // Remove the last element

                return {
                    _id: item._id,
                    userName: item.userName,
                    transactionId: item.transactionId,
                    amount: item.amount,
                    number: item.number,
                    paymentMethod: item.paymentMethod,
                    transactionType: item.transactionType,
                    paymentChannel: item.paymentChannel,
                    TimeDay: formatTime(item.createdAt),
                    statusNote: item.statusNote,
                    offerAmount: offer?.offerAmount,
                    totalAmount: (Number(item.amount) + Number(offer?.offerAmount)).toFixed(2),
                    oldTurnover: oldTurnover, // Include the old turnover values
                    newTurnover: Number(newTurnover).toFixed(2), // New turnover value after removing the last element,
                    transactionImage: item.transactionImage,
                };
            });

        return { message: "Successfully retrieved payment request information", queryDepositeData };
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

        const queryWithDrawData = matchAuthorData
            .filter(item => item.transactionType === 'withdraw' && item.requestStatus === 'Processing')
            .map(item => {
                const totalTurnover = item.offers?.reduce((current, offer) => current + offer?.turnover, 0);

                return {
                    _id: item._id,
                    userName: item.userName,
                    transactionType: item.transactionType,
                    amount: item.amount,
                    number: item.number,
                    paymentMethod: item.paymentMethod,
                    paymentChannel: item.paymentChannel,
                    todayTime: formatTime(item.createdAt),
                    TimeDay: formatDate(item.createdAt),
                    statusNote: item.statusNote,
                    totalTurnover: totalTurnover.toFixed(2),
                };
            });

        return { message: "Successfully retrieved payment request information", queryWithDrawData };
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
