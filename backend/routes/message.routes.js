import express from "express";
import protect from '../middleware/authMiddleware.js'
import * as messageControllers from '../controllers/message.controllers.js'

const router = express.Router();

router.route("/").post(protect, messageControllers.sendMessage);
router.route("/:chatId").get(protect, messageControllers.getMessageByChatId);

export default router;
