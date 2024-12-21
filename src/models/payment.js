import { model, Schema } from 'mongoose';

const payment = new Schema({
  userId: {
    type: Number,
  },
  amount: {
    type: Number,
  },
  trxID: {
    type: String,
  },
  paymentID: {
    type: String,
  },
  date: {
    type: String,
  }
}, { timestamps: true });

const paymentSchema = new Schema("payment", payment);


export { paymentSchema };