import crypto from "crypto";
import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import mongooseKeywords from "mongoose-keywords";
import { env } from "../../config";

const roles = ["user", "admin"];

const userSchema = new Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: roles,
      default: "user"
    },
    picture: {
      type: String,
      trim: true
    },
    organization: {
      orgId: String,
      name: String,
      orgType: String
    }
  },
  {
    timestamps: true
  }
);

userSchema.path("email").set(function(email) {
  if (!this.picture || this.picture.indexOf("https://gravatar.com") === 0) {
    const hash = crypto
      .createHash("md5")
      .update(email)
      .digest("hex");
    this.picture = `https://gravatar.com/avatar/${hash}?d=identicon`;
  }

  return email;
});

userSchema.pre("save", function(next) {
  if (!this.isModified("password")) return next();

  /* istanbul ignore next */
  const rounds = env === "test" ? 1 : 9;

  bcrypt
    .hash(this.password, rounds)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(next);
});

userSchema.methods = {
  view(full) {
    let view = {};
    let fields = ["id", "firstName", "lastName", "picture", "organization"];

    if (full) {
      fields = [...fields, "email", "createdAt"];
    }

    fields.forEach(field => {
      view[field] = this[field];
    });

    return view;
  },

  authenticate(password) {
    return bcrypt
      .compare(password, this.password)
      .then(valid => (valid ? this : false));
  }
};

userSchema.statics = {
  roles
};

userSchema.plugin(mongooseKeywords, {
  paths: ["email", "firstName", "lastName"]
});

const model = mongoose.model("User", userSchema);

export const schema = model.schema;
export default model;