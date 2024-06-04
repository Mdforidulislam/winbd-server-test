const { v4: uuidv4 } = require('uuid');
const PromotionOffers = require("../../../models/promotion");
const Transactions = require("../../../models/transactions");
const { sendEmail } = require('../../subadmin/email/email');
const { EmailBox } = require('../../../models/email');


const validateTransactionInfo = (transInfo) => {
    if (!transInfo || !transInfo.transactionType || !transInfo.amount || !transInfo.number || !transInfo.authorId) {
        return "Please provide correct data with required fields: transactionType, amount, number, authorId";
    }
    return null;
};

const calculatePromotionOffers = async (transInfo) => {
    const promotionTitles = transInfo.offers.map(item => item.title);
    const promotionOffers = await PromotionOffers.find({ title: { $in: promotionTitles } });

    const offerMap = promotionOffers.reduce((map, offer) => {
        map[offer.title] = offer;
        return map;
    }, {});

    transInfo.offers.forEach(item => {
        const promotionOffer = offerMap[item.title];
        if (promotionOffer && transInfo.amount >= promotionOffer.amount) {
            let offerAmount = 0;
            let turnover = 0;
            if (promotionOffer.percentage) {
                offerAmount = (transInfo.amount * promotionOffer.percentage) / 100;
            } else if (promotionOffer.fixedAmount) {
                offerAmount = promotionOffer.fixedAmount;
            }
            turnover = offerAmount + transInfo.amount * parseInt(promotionOffer.turnover, 10);
            item.offerAmount = offerAmount;
            item.turnover = turnover;
        }
    });
};


// insert data to database 


const insertTransaction = async (transInfo) => {
    try {
        // Validate transaction information
        const validationError = validateTransactionInfo(transInfo);
        if (validationError) {
            return { status: "error", message: validationError };
        }

        // Generate a unique ID if the transaction type is 'withdraw' and transactionId is not defined
        if (transInfo.transactionType === 'withdraw' && !transInfo.transactionId) {
            transInfo.transactionId = uuidv4();
        }

        // Calculate promotion offers if provided
        if (transInfo.offers && transInfo.offers.length > 0) {
            await calculatePromotionOffers(transInfo);
        }

        // Create and save the transaction
        const insertedTransaction = await Transactions.create(transInfo);

      

        // Send email notification
        const { authorId, userName, transactionType, amount, paymentMethod } = transInfo;
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        const subject = `New ${transactionType} Request`;
        const text = `
            User: ${userName}
            Transaction Type: ${transactionType}
            Amount: ${amount}
            Payment Method: ${paymentMethod}
            Date: ${currentDate}
            Time: ${currentTime}
            Status: Processing
        `;

        // Retrieve author's email
        const authorEmail = await EmailBox.findOne({ authoreId: authorId }).select('email').lean();
        const authorEmailAddress = authorEmail?.email;

        // Send email asynchronously
         sendEmail(subject, text, authorEmailAddress);
        if(insertedTransaction){
            return { status: "success", message: "Transaction inserted successfully", transaction: insertedTransaction };
        }
    } catch (error) {
        console.error("Error inserting transaction:", error);
        return { status: "error", message: "An error occurred while inserting transaction", error: error.message };
    }
};


module.exports = { insertTransaction };
