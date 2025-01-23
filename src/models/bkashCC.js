import mongoose from "mongoose";
import bcrypt from "bcrypt";

const bkashSchema = new mongoose.Schema(
  {

    marchent_Id: {
      type: String,
      required: true,
      trim: true,
      unique: true, 
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    api_key: {
      type: String,
      required: true,
    },
    secret_key: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// Hash sensitive fields before saving
bkashSchema.pre("save", async function (next) {
  if (this.isModified("bkash_password")) {
    this.bkash_password = await bcrypt.hash(this.bkash_password, 10);
  }
  if (this.isModified("bkash_api_key")) {
    this.bkash_api_key = await bcrypt.hash(this.bkash_api_key, 10);
  }
  if (this.isModified("bkash_secret_key")) {
    this.bkash_secret_key = await bcrypt.hash(this.bkash_secret_key, 10);
  }
  next();
});

// Exclude sensitive fields from response
bkashSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.bkash_password;
  delete obj.bkash_api_key;
  delete obj.bkash_secret_key;
  return obj;
};

const Bkash = mongoose.model("Bkash", bkashSchema);

export default Bkash;
