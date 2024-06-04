const { transactionRequestDeposite, transactionRequestWithdraw, transactionRestFeedback, verifyTransactionData } = require("../../../lib/subadmin/transactionRequest/transactionRequest");

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

// verifyData geting here

const getingVerifydata = async (req, res) => {
    try { 

        const authorId = req.query.authoreId;
        const finalResult = await verifyTransactionData(authorId);
        res.status(200).json(finalResult);

        } catch (error) {
            res.statu(500).json({
                error: error.message
            })
        };
};

// request status udpate and send status note 

const transactionRequsetFeedbackapi = async (req, res) => {
    try {
        const id = req.query.id;
        const requestStatus = req.query.status;
        const note = req.query.note;
        const transactionId = req.query.transactionId;
        const finalResult = await transactionRestFeedback(id, requestStatus,note,transactionId);
        res.status(200).json(finalResult);
     } catch (error) { res.status(500).json({ error: error.message }) };
};


module.exports = { getingTransactionRequestDeposite, getingTransactionRequestWithdraw , transactionRequsetFeedbackapi , getingVerifydata};
