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

  async getBkashHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization: getValue('id_token'),
      'x-app-key': getValue("api-key"),
    };
  }

  async createPayment(req, res) {
    try {
      const { userName, amount, ...extraInfo } = req.body;
      const transactionId = uuidv4();
      const merchantInvoice = `Inv${transactionId.substring(0, 5)}`;

      // Store transaction data temporarily
      setValue(`transaction_${transactionId}`, { userName, amount, merchantInvoice, ...extraInfo });

      console.log(`Creating payment for user: ${userName}, Amount: ${amount}`);

      // Call bKash API for payment creation
      const { data } = await axios.post(
        "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/create",
        {
          mode: '0011',
          payerReference: '1',
          callbackURL: "https://server.winpay.online/bkash-callback-url",
          amount,
          currency: 'BDT',
          intent: 'sale',
          merchantInvoiceNumber: merchantInvoice,
        },
        { headers: await this.getBkashHeaders() }
      );

      if (data?.bkashURL) {
        console.log(`Payment created successfully: ${data.bkashURL}`);
        return res.status(200).json({ redirectURL: data.bkashURL });
      }

      throw new Error(`bKash Error: ${data?.statusMessage || 'Unknown error'}`);

    } catch (error) {
      console.error("Payment creation failed:", error.message);
      return res.status(500).json({ error: 'Failed to create payment', details: error.message });
    }
  }

  async handleCallback(req, res) {
    try {
      const { paymentID, status } = req.query;

      console.log(`bKash Callback: Payment ID: ${paymentID}, Status: ${status}`);

      if (status === 'cancel' || status === 'failure') {
        console.log('Payment failed or cancelled.');
        return res.redirect("https://winpay.online");
      }

      if (status === 'success') {
        // Execute payment confirmation with bKash
        const { data } = await axios.post(
          "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/execute",
          { paymentID },
          { headers: await this.getBkashHeaders()}
        );

           console.log("bKash Execute Response:", data);

        if (data?.statusCode === '0000') {
          // Retrieve stored transaction info
          const transactionData = getValue(`transaction_${data.paymentID}`);
          if (!transactionData) throw new Error('Transaction data not found.');

          const transactionRecord = {
            transactionId: paymentID,
            transactionType: 'deposit',
            isAutoPay: true,
            ...transactionData,
          };

          // Save transaction in database
          const transaction = await Transactions.create(transactionRecord);
          console.log("Transaction Saved:", transaction);

          return res.redirect("https://winpay.online/profile/user");
        }

        throw new Error(`bKash Execution Failed: ${data?.statusMessage}`);
      }

      console.warn("Unhandled Payment Status:", status);
      return res.redirect("https://winpay.online");

    } catch (error) {
      console.error("Callback Processing Error:", error.message);
      return res.redirect("https://winpay.online/profile/user");
    }
  }

  async refundPayment(req, res) {
    try {
      const { trxID } = req.params;
      const payment = await Transactions.findOne({ transactionId: trxID });

      if (!payment) return res.status(404).json({ error: 'Transaction not found' });

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

      if (data?.statusCode === '0000') {
        console.log("Refund Successful:", data);
        return res.status(200).json({ message: 'Refund successful' });
      }

      throw new Error(`bKash Refund Failed: ${data?.statusMessage}`);

    } catch (error) {
      console.error("Refund Error:", error.message);
      return res.status(500).json({ error: 'Refund failed', details: error.message });
    }
  }
}

export default new PaymentController();
