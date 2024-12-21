import mongoose from "mongoose";

const paymentInstractionSchema = new mongoose.Schema({
  startTitle: {
    type: String,
    required: true
  },
  listItems: {
    type: [String],
    required: true
  },
  endTitle: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});

const PaymentInstraction = mongoose.model('payInstraction', paymentInstractionSchema);

export { PaymentInstraction };