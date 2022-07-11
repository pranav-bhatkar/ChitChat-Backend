const authcontroller = require("./controllers/auth-controller");
const ActivateController = require("./controllers/activate-controller");
const ChatController = require("./controllers/chat-controller");
const Mediacontroller = require("./controllers/media-controller");
const authMiddleware = require("./middlewares/auth-middleware");
const router = require("express").Router();

router.post("/api/send-otp", authcontroller.sendOtp);
router.post("/api/verify-otp", authcontroller.verifyOtp);
router.post("/api/activate", authMiddleware, ActivateController.activate);
router.get("/api/refresh", authcontroller.refresh);
router.post("/api/check-user", authcontroller.checkUser);
router.post("/api/getUser", authcontroller.getUser);
router.post("/api/chat/users", ChatController.getUsers);
router.post("/api/chat/Conversations", ChatController.getConversations);
router.post("/api/chat/getchat", ChatController.getChat);
router.post("/api/chat/createConversation", ChatController.createConversation);
router.post("/api/chat/sendMsg", ChatController.sendMsg);
router.post("/api/chat/getAllMsgs", ChatController.getAllMsgs);

router.get("/api/avatar", authMiddleware, Mediacontroller.getAvatar);
router.post("/api/logout", authMiddleware, authcontroller.logout);
router.post("/api/createContact", authMiddleware, Mediacontroller.createContact);
router.post("/api/getContacts", Mediacontroller.getContacts);

module.exports = router;
