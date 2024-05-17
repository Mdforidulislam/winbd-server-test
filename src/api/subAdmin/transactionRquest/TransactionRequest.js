const { transactionRequestDeposite, transactionRequestWithdraw, transactionRestFeedback } = require("../../../lib/subadmin/transactionRequest/transactionRequest");

/// geting transaction  and send to subadmin

const getingTransactionRequestDeposite = async (req, res) => {
    try {
        console.log(req.query.authurId, 'check the author');
        const authorId = req.query.authurId;
        const finalResult = await transactionRequestDeposite(authorId);
        res.status(200).json(finalResult);
    } catch (error) { res.status(500).json({ error: error.message }) };
};


// transaction request from users get and send to subamdin

const getingTransactionRequestWithdraw = async (req, res) => {
    try {
        const authorId = req.query.authurId;
        const finalResult = await transactionRequestWithdraw(authorId);
        res.status(200).json(finalResult);
    } catch (error) { res.status(500).json({ error: error.message }) };
};


const transactionRequsetFeedbackapi = async (req, res) => {
    try {
        const id = req.query.id;
        const requestStatus = req.query.status;
        const finalResult = await transactionRestFeedback(id, requestStatus);
        res.status(200).json(finalResult);
     } catch (error) { res.status(500).json({ error: error.message }) };
};


module.exports = { getingTransactionRequestDeposite, getingTransactionRequestWithdraw , transactionRequsetFeedbackapi};
