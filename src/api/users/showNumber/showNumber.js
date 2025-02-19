import { showNumberlib } from "../../../lib/users/showNumberlib/showNumberlib.js";

const showNumber = async (req, res) => {
    try { 
        const authorName = req.query.author;
        const userName = req.query.userName;
        const finalResult = await showNumberlib(authorName,userName);
        res.status(200).json(finalResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { showNumber };