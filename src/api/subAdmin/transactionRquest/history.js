const { transactionHistory } = require("../../../lib/subadmin/transactionRequest/history");

const getingHistoryapi = async (req, res) => {
    try {
        const atuhorId = req.query.authorId;
        const finalResult = await transactionHistory(atuhorId);
        res.status(200).json(finalResult);
     } catch (error) { res.status(500).json({ error: error.message }) };
}

module.exports = { getingHistoryapi };