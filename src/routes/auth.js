const express = require("express");
const authRouter = express.Router();
const validator = require("validator");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const { User } = require("../models/user");

//post data to  mongoDB dynamically for sign up
authRouter.post("/signup", async (req, res) => {
  try {
    //Encrypt the data
    const { firstName, lastName, emailId, password, photoUrl } = req.body;

    //validation of data
    await validateSignUpData(req);

    const passwordHash = await bcrypt.hash(password, 10);
    //create new instance of user model

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      photoUrl,
    });
    // save user in database
    const savedUser = await user.save();
    //when user sign up for direct sign in cookies send to browser for storage
    const token = await savedUser.getJWT();
    //expires cookies in 8 hours
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
    res.json({ message: "Sign up successfully", data: savedUser });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//login api
authRouter.post("/signIn", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });

    if (!user) throw new Error("Invalid Credentials");
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw new Error("Invalid Credentials");

    //create JWT token
    const token = await user.getJWT();
    // expires cookies in 8 hours
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
    res.json({ message: "Logged in successfully", data: user });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Not Logged in successfully", error: err.message });
  }
});
//logout api

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logged out successfully");
});

// forgot password
//password forgot api
authRouter.post("/forgotPassword", async (req, res) => {
  try {
    //validat email
    const { emailId, password } = req.body;

    const userInputPassword = password;

    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Email is not valid");
    // check password strong or not
    const isStrongPassword = await validator.isStrongPassword(
      userInputPassword
    );
    if (!isStrongPassword) throw new Error("Password is not strong");
    //create hash password
    const hashPassword = await bcrypt.hash(userInputPassword, 10);
    //save password to database
    user.password = hashPassword;
    user.save();
    res.send("Password successfully reset");
  } catch (err) {
    res.status(400).send(err.message);
  }
});
module.exports = { authRouter };
