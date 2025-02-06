import { setValue } from "node-global-storage";
import { 
    craatPaymentDB, 
    executePaymentDB, 
    paymentSearchDB, 
    refundPaymentDB 
} from "../../../lib/users/payment/bkash.js";

/**
 * Create a new payment request.
 */

const createPayment = async (req, res) => {
    try {

        const { userid, ...extraInfo } = req.body;
        setValue("username", userid); // Store user ID globally
        
        const response = await craatPaymentDB(extraInfo);
        console.log(response, 'check the response');
        
        res.status(200).json({
            message: "Payment created successfully",
            data: response.bkashURL,
            status: 200
        });

    } catch (error) {
        console.error("Create Payment Error:", error.message);
        res.status(500).json({
            message: "Failed to create payment",
            error: error.message,
            status: 500
        });
    }
};

/**
 * Handle bKash payment callback.
 */
const handleCallback = async (req, res) => {
    try {
        const paymentInfo = req.query;
        const response = await executePaymentDB(paymentInfo);
        const redirectURL = response.statusCode === '0000' ? "https://win-pay.xyz/profile/user" : "https://win-pay.xyz/profile/user";

        if(response.statusCode === '0000') {
            res.redirect(redirectURL)
        } else {
            res.redirect(redirectURL)
        }
    } catch (error) {
        console.error("Payment Execution Error:", error.message);
         res.status(500).json({
            message: "Failed to execute payment",
            error: error.message,
            status: 500
        });
    }
};

/**
 * Process a payment refund request.
 */
const refundPayment = async (req, res) => {
    try {
        const refundInfo = req.body;
        const result = await refundPaymentDB(refundInfo);

         res.status(200).json({
            message: "Refund processed successfully",
            data: result,
            status: 200
        });
    } catch (error) {
        console.error("Refund Error:", error.message);
         res.status(500).json({
            message: "Failed to process refund",
            error: error.message,
            status: 500
        });
    }
};

/**
 * Query a bKash transaction status.
 */
const bkashTransactionQuery = async (req, res) => {
    try {
        const queryInfo = req.query;
        const result = await paymentSearchDB(queryInfo);

         res.status(200).json({
            message: "Transaction query successful",
            data: result,
            status: 200
        });
    } catch (error) {
        console.error("Transaction Query Error:", error.message);
         res.status(500).json({
            message: "Failed to query transaction",
            error: error.message,
            status: 500
        });
    }
};

export { createPayment, handleCallback, refundPayment, bkashTransactionQuery };
