import { insertPaymentInstruction, getPaymentInstructions } from "../../lib/admin/paymentInstacttion.js";

const insertPayInstraction = async (req, res) => {
    try {
        const paymentInstraction = req.body;
        const finalResult = await insertPaymentInstruction(paymentInstraction);
        res.status(200).json(finalResult);
    } catch (error) {
        res.status(500).json({ error: message.error });
    }
};

//  geting data payment instraction

const getingPayInstraction = async (req, res) => {
    try {
        const getingFinalResult = await getPaymentInstructions();
        res.status(200).json(getingFinalResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { insertPayInstraction, getingPayInstraction };



