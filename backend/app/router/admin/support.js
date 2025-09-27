const router = require("express").Router();
const expressAsyncHandler = require("express-async-handler");
const {
  SupportController,
} = require("../../http/controllers/support/support.controller");

router.get("/tickets", expressAsyncHandler(SupportController.getAllTickets));

router.get(
  "/tickets/:id",
  expressAsyncHandler(SupportController.getAdminTicket)
);

router.post(
  "/tickets/:id/reply",
  expressAsyncHandler(SupportController.addAdminReply)
);

router.patch(
  "/tickets/:id/status",
  expressAsyncHandler(SupportController.updateTicketStatus)
);

router.get(
  "/tickets-stats",
  expressAsyncHandler(SupportController.getTicketStats)
);

router.patch(
  "/tickets/:id/mark-read",
  expressAsyncHandler(SupportController.markMessagesAsRead)
);

module.exports = {
  supportAdminRoutes: router,
};
