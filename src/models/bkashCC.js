import mongoose from "mongoose";
import bcrypt from "bcrypt"

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
      select: false,
    },
    api_key: {
      type: String,
      required: true,
      select: false,
    },
    secret_key: {
      type: String,
      required: true,
      select: false, 
    },
    method: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash sensitive fields before saving
bkashSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    if (this.isModified("api_key")) {
      this.api_key = await bcrypt.hash(this.api_key, 10);
    }
    if (this.isModified("secret_key")) {
      this.secret_key = await bcrypt.hash(this.secret_key, 10);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Exclude sensitive fields from the response
bkashSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.api_key;
  delete obj.secret_key;
  return obj;
};

const Bkash = mongoose.model("Bkash", bkashSchema);

export default Bkash;
