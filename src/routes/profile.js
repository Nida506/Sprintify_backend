const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const { User } = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");

//get user own profile , api
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//edit user own profile ,  api
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) throw new Error("Invalid edit  request");
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.send({
      message: `${loggedInUser.firstName} , your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//password forgot api
profileRouter.get("/profile/forgotPassword", async (req, res) => {
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
    res.send("Password successfully saved");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = { profileRouter };
