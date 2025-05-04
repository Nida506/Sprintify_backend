//create schema of database

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
// const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      // require: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // require: true,
    },

    photoUrl: {
      type: String,
      default:
        "https://staging.svgrepo.com/show/390455/user-person-account-avatar-profile-man.svg",
    },

    age: {
      type: Number,
      default: 15,
    },
    about: {
      type: String,
      default: "I am user of Sprintify",
    },
  },

  {
    timestamps: true,
  }
);

//helper functions

//for jWt token helper function
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Flicke@Tinder$790", {
    expiresIn: "7d",
  });
  return token;
};

//for password encryption helper function
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = this.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
