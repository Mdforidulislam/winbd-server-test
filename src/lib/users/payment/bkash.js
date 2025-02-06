import { createPayment, executePayment, queryPayment, searchTransaction, refundTransaction } from 'bkash-payment';
import { getValue, setValue } from 'node-global-storage';
import { v4 as uuidv4 } from 'uuid';
import { Transactions } from '../../../models/transactions.js';


// const {
//     username,
//     password,
//     api_key,
//     secret_key,
// } = async (userid) => {
//     return await Bkash.findOne({marchent_Id: userid});
// }


const bkashConfig = {
    base_url: 'https://tokenized.pay.bka.sh/v1.2.0-beta',
    username: '01600307010',
    password: '0mYV>KqbN)w',
    app_key: 'ncNSV3LZRNARrJJI00pMNsQ9tc',
    app_secret: '4urlmoV23DbfiHHAYNZ5i9hefI4BfSHeufahJIERqdcHRknPAqqU'
};


const generateRandomOrderNumber = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Ensures a 4-digit number
};

/**
 * Create a bKash payment
 */


const craatPaymentDB = async (info) => {
    try {

        const {
             amount ,
             ...extrainfo
        } = info;

        setValue("transactionInfo", extrainfo); 

        const orderNumber = generateRandomOrderNumber(); 
        const callbackURL = "https://server.winpay.online/bkash-callback-url";
        const paymentDetails = { 
            amount,
            callbackURL,
            orderID : orderNumber,
            reference : "1"

         };
        const result = await createPayment(bkashConfig, paymentDetails);
        return result;
    } catch (error) {
        console.error("Create Payment Error:", error.message);
        return { status: "error", message: error.message };
    }
};



/**
 * Execute a bKash payment
 */
const executePaymentDB = async (info) => {
    try {
        const { status, paymentID } = info;

        if (!paymentID) throw new Error("Payment ID is required");

        let response = {
            statusCode: '4000',
            statusMessage: 'Payment Failed'
        };

        if (status === 'success') {
            let retryCount = 0;
            let result = null;

            // Retry mechanism for executing payment
            while (retryCount < 3 && !result) {
                try {
                    result = await executePayment(bkashConfig, paymentID);
                    if (!result) throw new Error("Bkash API returned null response");
                } catch (err) {
                    retryCount++;
                    console.error(`Retry ${retryCount}: Failed to execute payment - ${err.message}`);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retrying
                }
            }

            if (result?.transactionStatus === 'Completed') {
                const infoGet = getValue("transactionInfo");

                if (!infoGet) throw new Error("Transaction info not found in cache");

                console.log(result, 'Bkash API response');
                console.log(infoGet, 'Retrieved transaction info');

                const modifyingdata = {
                    ...infoGet,
                    amount: result.amount,
                    transactionId: result.trxID,
                    isAutoPay: true,
                    paymentID: result.paymentID,
                    userNumber: result.payerAccount,
                };

                try {
                    const dbResponse = await Transactions.create(modifyingdata);
                    console.log(dbResponse, 'Saved transaction in database');
                } catch (dbError) {
                    console.error("Database Error:", dbError.message);
                }
            }

            if (result) {
                response = {
                    statusCode: result?.statusCode || '4000',
                    statusMessage: result?.statusMessage || 'Unknown Error'
                };
            }
        }

        return response;
    } catch (error) {
        console.error("Execute Payment Error:", error.message);
        return { status: "error", message: error.message };
    }
};



/**
 * Process a bKash payment refund
 */

const refundPaymentDB = async (info) => {
    try {
        const { paymentID, trxID, amount } = info;

        if (!paymentID || !trxID || !amount) throw new Error("Missing refund parameters");

        const refundDetails = { paymentID, trxID, amount };
        const result = await refundTransaction(bkashConfig, refundDetails);

        return result;
    } catch (error) {
        console.error("Refund Error:", error.message);
        return { status: "error", message: error.message };
    }
};

/**
 * Search for a transaction in bKash
 */
const paymentSearchDB = async (info) => {
    try {
        const { trxID } = info;

        if (!trxID) throw new Error("Transaction ID is required");

        const result = await searchTransaction(bkashConfig, trxID);
        return result;
    } catch (error) {
        console.error("Transaction Search Error:", error.message);
        return { status: "error", message: error.message };
    }
};

/**
 * Query bKash payment status
 */

const bkashQueryDB = async (info) => {
    try {
        const { paymentID } = info;

        if (!paymentID) throw new Error("Payment ID is required");

        const result = await queryPayment(bkashConfig, paymentID);
        return result;
    } catch (error) {
        console.error("bKash Query Error:", error.message);
        return { status: "error", message: error.message };
    }
};

export { craatPaymentDB, executePaymentDB, refundPaymentDB, paymentSearchDB, bkashQueryDB };
