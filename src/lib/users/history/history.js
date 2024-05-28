const Transaction = require("../../../models/transactions")

// fromData convert the database data time 
const formatDate = (date) => {
    const options = { day: '2-digit', month: 'numeric', year: 'numeric', timeZone: 'Asia/Dhaka' };
    return new Date(date).toLocaleDateString('en-US', options);
};

// fromData convert the database data time 
const formatTime = (date) => {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Dhaka'
    };
    return new Date(date).toLocaleTimeString('en-US', options);
};



// query the time rang for data time 

const getStartAndEndDate = (date) => {
    const now = new Date();
    let startDate, endDate;

    switch (date) {
        case 'Today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            endDate = new Date(now.setHours(23, 59, 59, 999));
            break;
        case 'Yesterday':
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'Last 7 days':
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 7);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date();
            break;
        default:
            throw new Error('Invalid date range');
    }

    return { startDate, endDate };
};


// geing history data list 

const userHistoryUpdateStatus = async (userName, status, paymentType, date = 'Today') => {
    try {
        if (!userName) {
            return { success: false, message: 'User name is required' };
        }
        const { startDate, endDate } = getStartAndEndDate(date);

        const searchCriteria = [
            { userName: userName },
            { createdAt: { $gte: startDate, $lte: endDate } },
        ];

        if (status) searchCriteria.push({ requestStatus: status });
        if (paymentType) searchCriteria.push({ transactionType: paymentType });

        const findSearchResult = await Transaction.find({ $and: searchCriteria });

        if (findSearchResult.length > 0) {
            const groupredData = findSearchResult.reduce((acc, item) => {
                const dateKey = formatDate(item.createdAt);
                if (!acc[dateKey]) {
                    acc[dateKey] = [];
                }

                acc[dateKey].push({
                    transactionType: item.transactionType,
                    amount: item.amount,
                    number: item.number,
                    transactionId: item.transactionId,                      
                    paymentMethod: item.paymentMethod,
                    requestStatus: item.requestStatus,
                    date: formatDate(item.createdAt),
                    time: formatTime(item.createdAt),
                    stutusNote: item.stutusNote
                });
                return acc;

            }, {});

            const finalResult = Object.keys(groupredData).map(date => ({
                date,
                data: groupredData[date]
            }))
            
            console.log(finalResult,'check the final result');

            return { success: true, data: finalResult };
        } else {
            return { success: false, message: 'No matching records found' };
        }
    } catch (error) {
        console.error('Error fetching user history:', error);
        return {
            success: false,
            message: 'An error occurred while fetching user history',
            error: error.message,
        };
    }
};




module.exports = {userHistoryUpdateStatus}