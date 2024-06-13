const { v4: uuidv4 } = require('uuid');

const Transactions = require("../../../models/transactions");
const { sendEmail } = require('../../subadmin/email/email');
const { EmailBox } = require('../../../models/email');
const PromotionOffersSave = require('../../../models/promotionsave');
const PromotionOffers = require('../../../models/promotion');



const validateTransactionInfo = (transInfo) => {
    if (!transInfo || !transInfo.transactionType || !transInfo.amount || !transInfo.userNumber || !transInfo.authorId) {
        return "Please provide correct data with required fields: transactionType, amount, number, authorId";
    }
    return null;
};

// calculation promotion 
const calculatePromotionOffers = async (transInfo) => {
    try {
        const promotionTitles = transInfo.offers.map(item => item.title);
        const promotionOffers = await PromotionOffers.find({ title: { $in: promotionTitles } });

        const offerMap = promotionOffers.reduce((map, offer) => {
            map[offer.title] = offer;
            return map;
        }, {});

        const promotionsToSave = transInfo.offers.map(item => {
            const promotionOffer = offerMap[item.title];
            if (promotionOffer && transInfo.amount >= promotionOffer.amount && transInfo.paymentChannel === 'cashout') {
                let offerAmount = 0;
                let turnover = 0;

                if (promotionOffer.percentage) {
                    offerAmount = (transInfo.amount * promotionOffer.percentage) / 100;
                } else if (promotionOffer.fixedAmount) {
                    offerAmount = promotionOffer.fixedAmount;
                }
                turnover = offerAmount + transInfo.amount * parseInt(promotionOffer.turnover, 10);

                // Create the promotion data to be saved
                return {
                    title: item.title,
                    offerAmount,
                    turnover,
                    transactionId: transInfo.transactionId,
                    userName: transInfo.userName,
                    amount: transInfo.amount,
                    authorId: transInfo.authorId
                };
            }
            return null;
        }).filter(promotion => promotion !== null);

        console.log(promotionsToSave);

        if (promotionsToSave.length > 0) {
            await PromotionOffersSave.insertMany(promotionsToSave);
        }

    } catch (error) {
        console.error("Error calculating promotion offers:", error);
        throw new Error("Failed to calculate promotion offers");
    }
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
        
        if (insertedTransaction) {
            return { status: "success", message: "Transaction inserted successfully", transaction: insertedTransaction };
        }

    } catch (error) {
        if (error.code === 11000) { // Duplicate key error code
            // Extract the fields that caused the duplicate key error
            const duplicateKeyField = Object.keys(error.keyValue)[0];
            
            // Only handle if transactionId is duplicated
            if (duplicateKeyField === 'transactionId') {
                // Check if there exists a transaction with the same transactionId and requestStatus 'Rejected'
                const existingTransaction = await Transactions.findOne({
                    transactionId: transInfo.transactionId,
                    requestStatus: 'Rejected'
                });

                if (existingTransaction) {
                    // Allow saving the new transaction with the same transactionId since the existing one has failed
                    transInfo._id = existingTransaction._id; // Keep the same _id to overwrite the existing document
                    transInfo.requestStatus = "Processing";
                    const updatedTransaction = await Transactions.findByIdAndUpdate(existingTransaction._id, transInfo, { new: true });
                    return { success: true, message: "Transaction inserted successfully", data: updatedTransaction };
                } else {
                    return { success: false, message: 'Transaction ID must be unique.' };
                }
            } else {
                return { success: false, message: `Duplicate key error on field ${duplicateKeyField}.` };
            }
        } else {
            return { success: false, message: error.message };
        }
    }
};



module.exports = { insertTransaction };
