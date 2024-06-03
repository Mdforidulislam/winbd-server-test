const Transactions = require("../../../models/transactions");

// Helper function to format the date in 'dd/mm/yyyy' format
const formatDate = (date) => {
    const options = { day: '2-digit', month: 'numeric', year: 'numeric', timeZone: 'Asia/Dhaka' };
    return new Date(date).toLocaleDateString('en-US', options);
};

// Helper function to format the time in 'hh:mm AM/PM' format
const formatTime = (date) => {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Dhaka'
    };
    return new Date(date).toLocaleTimeString('en-US', options);
};

// Helper function to get the start and end date for the given range
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

// Helper function to convert date and time to a Date object
const parseDateTime = (date, time) => {
    const [timePart, meridian] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    const adjustedHours = meridian.toUpperCase() === 'PM' ? (hours % 12) + 12 : hours % 12;
    return new Date(`${date} ${adjustedHours}:${minutes}`);
};


// Main function to fetch user history and update status
const userHistoryUpdateStatus = async (userName,searchList) => {
    if (!userName) {
        return { success: false, message: 'User name is required' };
    };

    const timeFrames = ['Yesterday', 'Today', 'Last 7 days'];
    const statuses = ['verify', 'Processing', 'Rejected', 'Approved'];
    const paymentTypes = ['withdraw', 'deposite'];

    let dateRange = 'Today'; // Default date range
    let status = [];
    let paymentType = [];

    // Determine the criteria from searchList
    for (const item of searchList) {
        if (timeFrames.includes(item)) {
            dateRange = item;
        } else if (statuses.includes(item)) {
            status.push(item);
        } else if (paymentTypes.includes(item)) {
            paymentType.push(item);
        }
    }

    const { startDate, endDate } = getStartAndEndDate(dateRange);

    // Build the search criteria
    const searchCriteria = {
        userName: userName,
        createdAt: { $gte: startDate, $lte: endDate }
    };

    if (status.length > 0) {
        searchCriteria.requestStatus = { $in: status };
    }

    if (paymentType.length > 0) {
        searchCriteria.transactionType = { $in: paymentType };
    }



    try {
        const transactions = await Transactions.find(searchCriteria);
        if (transactions.length === 0) {
            return { success: false, message: 'No matching records found' };
        }


        const groupedData = transactions.reduce((acc, item) => {
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
                statusNote: item.statusNote
            });

            return acc;
        }, {});

        console.log(groupedData);

        // Sort each group by time in ascending order
         for (const dateKey in groupedData) {
            groupedData[dateKey].sort((a, b) => parseDateTime(b.date, b.time) - parseDateTime(a.date, a.time));
        }

        const finalResult = Object.keys(groupedData).map(date => ({
            date,
            data: groupedData[date]
        })).sort((a, b) => new Date(b.date) - new Date(a.date)); // Ensure the dates themselves are in descending order

        return { success: true, data: finalResult };

    } catch (error) {
        console.error('Error fetching user history:', error);
        return {
            success: false,
            message: 'An error occurred while fetching user history',
            error: error.message,
        };
    }
};

module.exports = { userHistoryUpdateStatus };
