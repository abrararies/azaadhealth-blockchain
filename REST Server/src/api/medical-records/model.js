import mongoose, { Schema } from "mongoose";

const medicalRecordsSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  userDetails: {
    userID: Schema.Types.ObjectId,
    email: String,
    firstName: String,
    lastName: String
  },
  Description : String,
  Name : String,
  URL: String,
  meta: {}
});

const model = mongoose.model("MedicalRecords", medicalRecordsSchema);

export const schema = model.schema;
export default model;
