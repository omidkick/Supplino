const router = require("express").Router();
const expressAsyncHandler = require("express-async-handler");

const { verifyAccessToken } = require("../http/middlewares/user.middleware");
const {
  SupportController,
} = require("../http/controllers/support/support.controller");

router.post(
  "/tickets",
  verifyAccessToken,
  expressAsyncHandler(SupportController.createTicket)
);

router.get(
  "/tickets",
  verifyAccessToken,
  expressAsyncHandler(SupportController.getUserTickets)
);

router.get(
  "/tickets/:id",
  verifyAccessToken,
  expressAsyncHandler(SupportController.getTicket)
);

router.post(
  "/tickets/:id/reply",
  verifyAccessToken,
  expressAsyncHandler(SupportController.addReply)
);

router.patch(
  "/tickets/:id/mark-read",
  verifyAccessToken,
  expressAsyncHandler(SupportController.markMessagesAsRead)
);

router.delete(
  "/tickets/:id",
  verifyAccessToken,
  expressAsyncHandler(SupportController.deleteTicket)
);

module.exports = {
  supportRoutes: router,
};
