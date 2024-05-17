const { insertTransaction } = require("../../../lib/users/transaction/transaction");


const transactionSave = async (req, res) => {
    try { 
        const transactionInfo = req.body;
        const finalResult = await insertTransaction(transactionInfo);
        res.status(200).json(finalResult);
    } catch (error) { 
        res.status(500).json({ error :  error.message})
    };
}


module.exports = { transactionSave };