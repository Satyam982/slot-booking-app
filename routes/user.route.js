const { Router } = require("express");
const userController = require("../cotrollers/user.controller");
const middleware = require("../middlewares/middleware");

const router = Router();

// User apis
router.post('/slot-book-by-user',middleware.isUser, userController.slotBookByUser);

// Admin apis
router.post('/slot-book-by-admin',middleware.isAdmin, userController.slotBookByAdmin);

module.exports = router;