import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  authoreId: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
    trim: true,
  }
});

const EmailBox = mongoose.model('emailbox', emailSchema);

export { EmailBox };