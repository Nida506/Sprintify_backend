const validator = require("validator");
const { User } = require("../models/user");
const validateSignUpData = async (req) => {
  const { firstName, lastName, emailId, password, age, about } = req.body;

  if (!firstName || !lastName) throw new Error("Name is required");

  if (!validator.isEmail(emailId)) throw new Error("Invalid email format");

  const existingUser = await User.findOne({ emailId });
  if (existingUser) {
    throw new Error("User with that email already exists");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong ");
  }

  return true;
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];
  const updates = Object.keys(req.body);

  const isValidOperation = updates.every((field) =>
    allowedEditFields.includes(field)
  );
  if (!isValidOperation) throw new Error("Invalid fields in update");

  const { firstName, lastName, age, photoUrl, about } = req.body;

  if (!firstName) throw new Error("First name cannot be empty");
  if (!lastName) throw new Error("Last name cannot be empty");

  if (age === undefined || typeof age !== "number" || age < 10 || age > 60) {
    if (!age) throw new Error("Age is required");

    throw new Error("Age must be  between 10 and 60");
  }

  if (!photoUrl) {
    throw new Error("Photo URL is required");
  }

  if (!about || about.length > 20) {
    if (!about) throw new Error("About is required");
    throw new Error("About must be  20 characters long");
  }
  return true;
};

module.exports = { validateSignUpData, validateEditProfileData };
