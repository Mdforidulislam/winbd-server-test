const { userHistoryUpdateStatus } = require("../../../lib/users/history/history");


const userHistoryGeting = async (req, res) => {
    try {

        const authorId = req.query.userName;
        const timeDay = req.query.date;
        const paymentType = req.query.paymentType;
        const PaymentStatus = req.query.status;
        const finalResult = await userHistoryUpdateStatus(authorId, PaymentStatus, paymentType, timeDay);
        res.status(200).json(finalResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { userHistoryGeting };