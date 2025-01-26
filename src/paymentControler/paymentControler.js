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

  // Method to create payment
  async createPayment(req, res) {
    const {userName,amount, ...extrainfo} = req.body;

     setValue("transactionInfoPay",{
      userName ,
      amount , 
      ...extrainfo
     })

    try {
      const { data } = await axios.post(
        "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/create",
        {
          mode: '0011',
          payerReference: '1',
          callbackURL:"http://localhost:5000/bkash-callback-url", 
          amount,
          currency: 'BDT',
          intent: 'sale',
          merchantInvoiceNumber: `Inv${uuidv4().substring(0, 5)}`,
        },
        { headers: await this.getBkashHeaders() }
      );

      if (data && data.bkashURL) {

        return res.status(200).json({ redirectURL: data.bkashURL });
      } else {
        return res.status(500).json({ error: 'Failed to create payment, no redirect URL.' });
      }

    } catch (error) {
      console.error('Error creating payment:', error.message);
      return res.status(500).json({ error: 'Failed to create payment' });
    }
  }

  // Method to handle BKash callback and redirect accordingly
  async handleCallback(req, res) {
    const { paymentID, status , signature } = req.query;

    // If payment is canceled or failed, redirect to error page
    if (status === 'cancel' || status === 'failure') {
      console.log('Payment canceled or failed');
      return res.redirect(`https://winbd-client-fizf.vercel.app`);
    }

    // If payment is successful, process the payment
    if (status === 'success') {
      try {
        const { data } = await axios.post(
          "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/execute",
          { paymentID },
          { headers: await this.getBkashHeaders() }
        );

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
          console.log(transaction,'check the transaction here !!');

          console.log('Payment successful, redirecting to success page');
          return res.redirect(`https://winbd-client-fizf.vercel.app/profile/user`);
        } else {
          console.log('Payment failed:', data.statusMessage);
          return res.redirect(`http://localhost:5173/profile/user`);
        }
      } catch (error) {
        console.error('Error processing callback:', error.message);
        return res.redirect(`https://winbd-client-fizf.vercel.app`);
      }
    }

    console.log('check is return call back')
    // Handle unexpected status (for logging or debugging purposes)
    return res.redirect(`https://winbd-client-fizf.vercel.app`);
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
