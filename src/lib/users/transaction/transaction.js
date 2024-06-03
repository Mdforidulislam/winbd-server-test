const { v4: uuidv4 } = require('uuid');
const PromotionOffers = require("../../../models/promotion");
const Transaction = require("../../../models/transactions");

const insertTransaction = async (transInfo) => {
    try {
        // Check if transInfo is provided and has required fields
        if (!transInfo || !transInfo.transactionType || !transInfo.amount || !transInfo.number || !transInfo.authorId) {
            return { message: "Please provide correct data with required fields: transactionType, amount, number, authorId" };
        }

       

        // If the transactionType is 'withdraw' and transactionId is not defined, generate a unique ID
        if (transInfo.transactionType === 'withdraw' && !transInfo.transactionId) {
            transInfo.transactionId = uuidv4();
        }

        //  calculation promotion offer here 
        if (transInfo.offers && transInfo.offers.length > 0) {
            for (const item of transInfo.offers) {
                const promotionOffer = await PromotionOffers.findOne({ title: item.title });
                if (promotionOffer && transInfo.amount >= promotionOffer.amount) {
                    let offerAmount = 0;
                    let turnover = 0;
                    if (promotionOffer.percentage) {
                        offerAmount = (transInfo.amount * promotionOffer.percentage) / 100;
                    } else if (promotionOffer.fixedAmount) {
                        offerAmount = promotionOffer.fixedAmount;
                    }
                    // inlcude the opbiotn value 
                    turnover = offerAmount + transInfo.amount * parseInt(promotionOffer.turnover);
                    item.offerAmount = offerAmount;
                    item.turnover = turnover;
                }
            }
        }

        // Create and save the transaction
        const insertedTransaction = await Transaction.create(transInfo);

        if (insertedTransaction) {
            return { message: "Transaction inserted successfully" };
        }
    } catch (error) {
        console.error("Error inserting transaction:", error);
        return { message: "An error occurred while inserting transaction" };
    }
};

module.exports = { insertTransaction };
