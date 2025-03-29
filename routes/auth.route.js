const { Router } = require("express");
const authController = require("../cotrollers/auth.controller")

const router = Router();

router.post('/login', authController.login);

module.exports = router;