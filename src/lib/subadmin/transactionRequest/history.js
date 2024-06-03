const Transactions = require("../../../models/transactions");



const formatDate = (date) => {
    const options = { day: '2-digit', month: 'numeric', year: 'numeric', timeZone: 'Asia/Dhaka' };
    return new Date(date).toLocaleDateString('en-US', options);
};

const formatTime = (date) => {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Dhaka'
    };
    const formattedTime = new Date(date).toLocaleTimeString('en-US', options);
    const [time, period] = formattedTime.split(' ');
    return time.replace(':', '.') + ' ' + period;
};

// date  parseDAtetoString 
const parseDateString = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
};

// data converter 
const formatDateConvert = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1; // Months are zero-based
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
};


const transactionHistory = async (authorId, userName, pageNumber , date) => {
    try {

        if (!authorId || authorId == '') {
            return { message: "Please provide a valid authorId" };
        }

        console.log(authorId);

        // Build the search criteria
        let searchCriteria = {};

        if (authorId) searchCriteria.authorId = authorId; // Utilizes the index on authorId
        if (userName) searchCriteria.userName = userName; // Utilizes the index on userName
        if (date) {
            const dataConvert = formatDateConvert(date); // convert date
            const startDay = parseDateString(dataConvert);
            startDay.setHours(0, 0, 0, 0);
            const endDay = new Date(startDay);
            endDay.setHours(23, 59, 59, 999);
            searchCriteria.createdAt = {
                $gte: startDay,
                $lte: endDay
            }; // Utilizes the index on createdAt
        }

        // Query the database
        const userHistory = await Transactions.find(searchCriteria).skip(30  * pageNumber).limit(parseInt(30)).lean();

        if (!userHistory || userHistory.length === 0) {
            return { message: "No data found" };
        }

        const mappedData = userHistory.map(item => ({
            userName: item.userName,
            transactionType: item.transactionType,
            amount: item.amount,
            requestStatus: item.requestStatus,
            time: formatTime(item.createdAt),
            date: formatDate(item.createdAt),
            stutusNote: item.stutusNote,
            number: item.number,
            paymentMethod: item.paymentMethod,
            transactionId: item.transactionId
        }));

        const requestApprovdeData = mappedData.filter(item => item.requestStatus !== 'Processing' && item.requestStatus !== 'verify');

        return { message: "Successfully received data", requestApprovdeData };

    } catch (error) {
        console.error(error);
        return { message: "An error occurred", error: error.message };
    }
};

module.exports = { transactionHistory };

