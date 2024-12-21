import { insertTransaction } from "../../../lib/users/transaction/transaction.js";

const transactionSave = async (req, res) => {
    try { 
        const transactionInfo = req.body;
        const finalResult = await insertTransaction(transactionInfo);
        res.status(200).json(finalResult);
    } catch (error) { 
        res.status(500).json({ error :  error.message })
    };
}

export { transactionSave };