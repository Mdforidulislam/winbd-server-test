import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        trim: true
      },
      depositeChannel: {
        type: String,
        required: true,
        trim: true
      },
      transactionMethod: {
        type: String,
        required: true,
        trim: true,
        index: true
      },
      Logo: {
        type: String,
        required: true,
        trim: true
      },
      authorId: {
        type: String,
        required: true,
        index: true,
        trim: true
      },
      note: {
        title: { type: String, required: false, trim: true },
        list: [{ type: String, trim: true }],
        remainder: { type: String, required: false, trim: true }
      },
      idNumber: {
        type: String,
        index: true
      },
      status: {
        type: String,
        default: 'deActive',
        trim: true,
        index: true
      },

      activePayMethod: [
        {
          type: { type: String, required: true },
          allowed: { type: Boolean, required: true }
        }
      ]
});

// Compound index for authorId and transactionMethod
paymentMethodSchema.index({ authorId: 1, transactionMethod: 1 });

const PaymentMethodDeafult = mongoose.model('PaymentMethodDeafult', paymentMethodSchema);
const PaymentMethodActive = mongoose.model('PaymentMethodActive', paymentMethodSchema);

export { PaymentMethodDeafult, PaymentMethodActive };

