const Transaction = require("../../../models/transaction");


const transactionHistory = async (athurId) => {
    try {
        if (!athurId || athurId === '') {
            return { message: "Please provide a valid authorId" };
        }

        const userHistory = await Transaction.find({ authorId: athurId });
        if (!userHistory || userHistory.length === 0) {
            return { message: "No data found" };
        }

        const requestApprovdeData = userHistory.filter(item => item.requestStatus !== 'Processing').map(item => ({
            _id: item._id,
            userName: item.userName,
            transactionType: item.transactionType,
            amount: item.amount,
            requestStatus: item.requestStatus,
            createdAt: formatTime(item.createdAt)
        }));

        return { message: "Successfully recived data", requestApprovdeData };

    } catch (error) { return error };
};

const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedTime = new Date(date).toLocaleTimeString('en-US', options);
    const [time, period] = formattedTime.split(' ');
    return time.replace(':', '.') + ' ' + period;
};

module.exports = { transactionHistory };
