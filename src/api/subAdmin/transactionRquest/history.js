import { transactionHistory } from "../../../lib/subadmin/transactionRequest/history.js";

// geting history value 
const getingHistoryapi = async (req, res) => {
    try {
  
        const atuhorId = req.query.authorId;
        const date = req.query.date;
        const userName = req.query.userName;
        const pageNumber = req.query.pageNumber;
        const finalResult = await transactionHistory(atuhorId, userName, pageNumber, date);
        res.status(200).json(finalResult);

     } catch (error) { res.status(500).json({ error: error.message }) };
}

export { getingHistoryapi };