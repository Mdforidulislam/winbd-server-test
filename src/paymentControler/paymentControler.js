import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getValue, setValue } from 'node-global-storage';
import { Transactions } from '../models/transactions.js';



class PaymentController {

  constructor() {
    this.getBkashHeaders = this.getBkashHeaders.bind(this);
    this.createPayment = this.createPayment.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
    this.refundPayment = this.refundPayment.bind(this);
  }

  // Method to get headers required for bkash API requests
  async getBkashHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization: getValue('id_token'),
      'x-app-key': getValue("api-key"),
    };
  }

  async createPayment(req, res) {

    const { userName, amount, ...extrainfo } = req.body;
  
    // Set transaction info for later use or logging
    setValue("transactionInfoPay", {
      userName,
      amount,
      ...extrainfo
    });
  
    console.log('check next middleware perfactly run ',userName, amount);
  
    const maxRetries = 3; // Number of retry attempts
    let attempt = 0;
    let lastError = null;
  
    // Retry mechanism
    while (attempt < maxRetries) {
      attempt += 1;
      try {
        console.log(`Attempt ${attempt} to create payment with amount: ${amount}`);
  
        // Sending the payment creation request
        const { data } = await axios.post(
          "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create",
          {
            mode: '0011',
            payerReference: '1',
            callbackURL: "https://server.win-pay.xyz/bkash-callback-url", 
            amount,
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: `Inv${uuidv4().substring(0, 5)}`,
          },
          { headers: await this.getBkashHeaders() }
        );
  
        console.log(data,'check the payment create response=============>')
        // Check if the response has the `bkashURL`
        if (data && data.bkashURL) {
          console.log('Payment created successfully, redirecting to:', data.bkashURL);
          return res.status(200).json({ redirectURL: data.bkashURL });
        } else {
          throw new Error('No redirect URL in the response');
        }
      } catch (error) {
        // Capture and log the error for each attempt
        lastError = error;
        console.error(`Error on attempt ${attempt}:`, error.message);
  
        // If it's the last retry, return the error response
        if (attempt === maxRetries) {
          console.error('Max retries reached. Failing payment creation.');
          return res.status(500).json({
            error: 'Failed to create payment after multiple attempts',
            details: lastError ? lastError.message : 'Unknown error',
          });
        }
      }
  
      // Delay before retrying (optional)
      console.log(`Retrying payment creation in 2 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay before retry
    }
  }

  // Method to handle BKash callback and redirect accordingly
  async handleCallback(req, res) {
    const data = req.query;
    const {paymentID, status} = data;



    // If payment is canceled or failed, redirect to error page
    if (status === 'cancel' || status === 'failure') {
      console.log('Payment canceled or failed');
      return res.redirect(`https://win-pay.xyz`);
    }

    // If payment is successful, process the payment
    if (status === 'success') {
      try {
        const { data } = await axios.post(
          "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/execute",
          { paymentID },
          { headers: await this.getBkashHeaders() }
        );

        console.log(data,'check the payment execute')

        // Check if the payment was executed successfully
        if (data && data.statusCode === '0000') {
          const getValueTransaction = getValue("transactionInfoPay");
          const CustomerInfo = {
            transactionId:  paymentID,
            isAutoPay: true,
            transactionType: 'deposite',
            ...getValueTransaction
          }

          console.log(CustomerInfo,'check all the type here !!')
          //  transaction payment exute 
          const transaction = await Transactions.create(CustomerInfo);
          console.log(transaction,'check all the type here  successfuly transaction!!')

          console.log('Payment successful, redirecting to success page');
          return res.redirect(`https://win-pay.xyz/profile/user`);
        } else {
          console.log('Payment failed:', data.statusMessage);
          return res.redirect(`https://win-pay.xyz/profile/user`);
        }
      } catch (error) {
        console.error('Error processing callback:', error.message);
        return res.redirect(`https://win-pay.xyz/profile/user`);
      }
    }

    console.log('check is return call back')
    // Handle unexpected status (for logging or debugging purposes)
    return res.redirect(`https://win-pay.xyz`);
  }

  // Method to handle payment refund
  async refundPayment(req, res) {
    const { trxID } = req.params;

    try {
      const payment = await paymentModel.findOne({ trxID });
      if (!payment) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      const { data } = await axios.post(
        process.env.BKASH_REFUND_TRANSACTION_URL,
        {
          paymentID: payment.paymentID,
          amount: payment.amount,
          trxID,
          sku: 'payment',
          reason: 'cashback',
        },
        { headers: await this.getBkashHeaders() }
      );

      if (data && data.statusCode === '0000') {
        return res.status(200).json({ message: 'Refund successful' });
      } else {
        return res.status(500).json({ error: 'Refund failed', details: data });
      }

    } catch (error) {
      console.error('Refund error:', error.message);
      return res.status(500).json({ error: 'Refund failed' });
    }
  }
}

export default new PaymentController();
