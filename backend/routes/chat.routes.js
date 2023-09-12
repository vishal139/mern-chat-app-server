import express from "express";
import protect from "../middleware/authMiddleware.js";

import * as chatControllers from "../controllers/chat.controller.js";

const router = express.Router();

router.route("/").post(protect, chatControllers.accessChat).get(protect, chatControllers.getAllChat);
router.route("/group").post(protect, chatControllers.createGroupChat);
router.route("/removeFromGroup").put(protect, chatControllers.removeFromGroup);
router.route("/addToGroup").put(protect, chatControllers.addToGroup);
router.route("/rename").put(protect, chatControllers.renameGroup);


export default router;
