const bcrypt = require("bcryptjs");
const userModel = require("../model/user.model");
const jsonwebtoken = require("jsonwebtoken");
const { userRegistrationSchema } = require("../schema/user-schema");
const { z } = require("zod");

const authController = {};

authController.login = async (req, res) => {
  try {
    userRegistrationSchema.parse(req.body); // This will validate the body
    const { email, password } = req.body;

    const userData = await userModel.findOne({ email });

    console.log("userdsra", userData);

    if (!userData) {
      res.status(400).json({ msg: "Invalid email or password" });
    } else {
      const isValidPassword = bcrypt.compare(password, userData.password);

      if (isValidPassword) {
        const data = {
          email,
          password,
          userId: userData.id,
          isAdmin: userData.isAdmin,
        };

        const token = jsonwebtoken.sign(data, process.env.SECRET_KEY);

        console.log("token");

        res.status(400).json({ msg: "Login successfull", token });
      } else {
        res.status(400).json({ msg: "Invalid email or password" });
      }
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((e) => e.message);
      return res.status(400).json({
        error: "Validation failed",
        messages: errorMessages, // Sending a list of validation error messages
      });
    }
    res.status(500).json({
        error: 'An unexpected error occurred',
    });
  }
};

module.exports = authController;
