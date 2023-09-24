const express = require("express");
const router = express.Router();
const joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const {
  postLogin,
  postRegister,
} = require("../controllers/auth/authControllers");

const registerSchema = joi.object({
  username: joi.string().min(3).required(),
  password: joi.string().min(6).required(),
  mail: joi.string().email().required(),
});

const loginSchema = joi.object({
  mail: joi.string().min(3).required(),
  password: joi.string().min(6).required(),
});

router.post("/register", validator.body(registerSchema), postRegister);

router.post("/login", validator.body(loginSchema), postLogin);

module.exports = router;
