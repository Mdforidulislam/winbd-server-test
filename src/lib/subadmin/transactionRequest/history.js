

// Date formatting functions
const formatDate = (date) => {
    const options = { day: '2-digit', month: 'numeric', year: 'numeric', timeZone: 'Asia/Dhaka' };
    return new Date(date).toLocaleDateString('en-US', options);
};

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

    // Return the formatted time string with ':' replaced by '.' and the period appended
    return time.replace(':', '.') + ' ' + period;
};


// Build search criteria for the query
const buildSearchCriteria = (authorId, searchValue, date) => {
    const searchCriteria = { authorId: authorId };

    if (searchValue) {
        const searchRegex = new RegExp(searchValue, 'i');
        searchCriteria.$or = [
            { userName: { $regex: searchRegex } },
            { transactionId: { $regex: searchRegex } },
            { number: { $regex: searchRegex } }
        ];
    }

    if (date) {
        const startDay = new Date(date);
        startDay.setHours(0, 0, 0, 0);
        const endDay = new Date(date);
        endDay.setHours(23, 59, 59, 999);
        searchCriteria.createdAt = {
            $gte: startDay,
            $lte: endDay
        };
    }

    return searchCriteria;
};

// Fetch transaction history
const transactionHistory = async (authorId, searchValue, pageNumber, date) => {
    try {
        if (!authorId) {
            return { message: "Please provide a valid authorId" };
        }

        console.log(`Author ID: ${authorId}`);
        console.log(`Search Value: ${searchValue}`);
        console.log(`Page Number: ${pageNumber}`);
        console.log(`Date: ${date}`);

        const searchCriteria = buildSearchCriteria(authorId, searchValue, date);
        console.log('Search Criteria:', JSON.stringify(searchCriteria, null, 2));


        

        let perPage = 30;

        const skipCount = pageNumber * perPage;

        const [userHistory, transactionHistoryLength] = await Promise.all([
            Transactions.find(searchCriteria).sort({ createdAt: -1 }).skip(skipCount).limit(perPage).lean(),
            Transactions.countDocuments(searchCriteria)
        ]);

        if (userHistory.length === 0) {
            return { message: "No data found" };
        }

        return formatResponse(userHistory, transactionHistoryLength, perPage);

    } catch (error) {
        console.error('Error fetching transaction history:', error);
        return { message: "An error occurred", error: error.message };
    }
};

// Format response data
const formatResponse = (history, length, perPage) => {
    const mappedData = history.map(item => ({
        userName: item.userName,
        transactionType: item.transactionType,
        amount: item.amount,
        requestStatus: item.requestStatus,
        time: formatTime(item.createdAt),
        date: formatDate(item.createdAt),
        statusNote: item.statusNote,
        userNumber: item.userNumber,
        authoreNumber: item.authoreNumber,
        paymentMethod: item.paymentMethod,
        transactionId: item.transactionId,
        authorId: item?.authorId,
    }));

    const requestApprovedData = mappedData.filter(item => item.requestStatus !== 'Processing' && item.requestStatus !== 'verify');
    const totalPages = Math.ceil(length / perPage);

    return {
        message: "Successfully received data",
        requestApprovedData,
        totalPages
    };
};

export { transactionHistory };
