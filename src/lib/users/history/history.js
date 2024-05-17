const Transaction = require("../../../models/transaction")


// geting users history data 
const formatDate = (date) => {
    const options = { day: '2-digit', month: 'numeric', year: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString('en-GB', options);
    return formattedDate;
};

const userHistoryUpdateStatus = async (userName, status, paymentType, date) => {
    try {
        if (status && paymentType && date && userName) {
            console.log('Accessing the API');
            const now = new Date();
            let startDate, endDate;

            if (date === 'Today') {
                startDate = new Date(now.setHours(0, 0, 0, 0));
                endDate = new Date(now.setHours(23, 59, 59, 999));
            } else if (date === 'Yesterday') {
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 1);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setHours(23, 59, 59, 999);
            } else if (date === 'Last 7 days') {
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 7);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
            }

            console.log('Search criteria:', {
                requestStatus: status,
                transactionType: paymentType,
                createdAt: { $gte: startDate, $lte: endDate },
                userName: userName
            });

            const searchCriteria = [
                { requestStatus: status },
                { transactionType: paymentType },
                { createdAt: { $gte: startDate, $lte: endDate } },
                { userName: userName }
            ];

            const findSearchResult = await Transaction.find({ $and: searchCriteria });
            console.log('Search results:', findSearchResult);
            
            if (findSearchResult.length > 0) {
                const finalSearchData = findSearchResult.map((item) => ({
                    transactionType: item.transactionType,
                    amount: item.amount,
                    requestStatus: item.requestStatus,
                    dateTime: formatDate(item.createdAt) // Ensure date formatting
                }));
                return {
                    success: true,
                    data: finalSearchData
                };
            } else {
                return {
                    success: false,
                    message: 'No matching records found'
                };
            }
        } else {
            const defaultResultShow = await Transaction.find({ userName: userName });
            console.log('Default results:', defaultResultShow);
            const finalDefaultData = defaultResultShow.map((item) => ({
                transactionType: item.transactionType,
                amount: item.amount,
                requestStatus: item.requestStatus,
                dateTime: formatDate(item.createdAt) // Ensure date formatting
            }));
            return {
                success: true,
                data: finalDefaultData
            };
        }
    } catch (error) {
        console.error('Error fetching user history:', error);
        return {
            success: false,
            message: 'An error occurred while fetching user history',
            error: error.message
        };
    }
};

module.exports = {userHistoryUpdateStatus}