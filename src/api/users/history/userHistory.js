import { userHistoryUpdateStatus } from "../../../lib/users/history/history.js";

const userHistoryGeting = async (req, res) => {
    const { userName, searchList } = req.query;

    if (!userName) {
        return res.status(400).json({ success: false, message: 'User name is required' });
    }

    // Ensure searchList is an array
    let searchItems = [];
    if (typeof searchList === 'string') {
        searchItems = [searchList];
    } else if (Array.isArray(searchList)) {
        searchItems = searchList;
    }
    
    try {
        const finalResult = await userHistoryUpdateStatus(userName, searchItems);
        res.json(finalResult);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export { userHistoryGeting };