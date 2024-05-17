const { showNumberlib } = require("../../../lib/users/showNumberlib/showNumberlib");

const showNumber = async (req, res) => {
    try { 
        const authorName = req.query.author;
        const transactionType = req.query.transType;
        const transactionMethod = req.query.method;
        
        console.log(authorName,transactionMethod,transactionType ,'check the value here ');


        const finalResult = await showNumberlib(authorName,transactionType,transactionMethod);
        res.status(200).json(finalResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { showNumber };