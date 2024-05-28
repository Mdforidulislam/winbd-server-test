const { showNumberlib } = require("../../../lib/users/showNumberlib/showNumberlib");

const showNumber = async (req, res) => {
    try { 
        const authorName = req.query.author;
        const transactionMethod = req.query.method;
        const userName = req.query.userName;
        const finalResult = await showNumberlib(authorName,transactionMethod,userName);
        res.status(200).json(finalResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { showNumber };