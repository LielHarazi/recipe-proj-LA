import mongoose, { Schema } from "mongoose";
import { IContact } from "../types";

const contactSchema = new Schema<IContact>(
  {
    name: String,
    email: String,
    message: String,
  },
  {
    timestamps: true,
  }
);
contactSchema.pre("save", function (this: IContact, next) {
  console.log(`[PRE-SAVE] Document about to be saved: ${this._id}`);
  next();
});

const Contact = mongoose.model<IContact>("Contact_messages", contactSchema);
export default Contact;
