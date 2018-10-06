import mongoose, { Schema } from "mongoose";

const claimSchema = new Schema(
  {
    Files: [
      {
        URL: String,
        ObjectID: Schema.Types.ObjectId
      }
    ],
    UserID: {
      type: String
    },
    Title: {
      type: String
    },
    Description: {
      type: String
    },
    Status: {
      type: String
    },
    SubmissionDate: {
      type: String
    },
    InsuranceCompany: {
      type: String
    },
    Employer: {
      type: String
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (obj, ret) => {
        delete ret._id;
      }
    }
  }
);

claimSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      Files: this.Files,
      UserID: this.UserID,
      Title: this.Title,
      Description: this.Description,
      Status: this.Status,
      SubmissionDate: this.SubmissionDate,
      InsuranceCompany: this.InsuranceCompany,
      Employer: this.Employer,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    return full
      ? {
          ...view
          // add properties for a full view
        }
      : view;
  }
};

const model = mongoose.model("Claim", claimSchema);

export const schema = model.schema;
export default model;
