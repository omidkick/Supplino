const router = require("express").Router();
const expressAsyncHandler = require("express-async-handler");
// const { verifyAccessToken } = require("../http/middlewares/user.middleware");
// const { authorize } = require("../../http/middlewares/authorize.middleware");
const {
  CommentController,
} = require("../../http/controllers/comment/comment.controller");
const { verifyAccessToken } = require("../../http/middlewares/user.middleware");
const { authorize } = require("../../http/middlewares/permission.guard");

// ADMIN ONLY: Get all comments
router.get(
  "/list",
  verifyAccessToken,
  authorize("ADMIN"),
  expressAsyncHandler(CommentController.getAllComments)
);

// ADMIN ONLY: Delete all comments
router.delete(
  "/delete-all",
  verifyAccessToken,
  authorize("ADMIN"),
  expressAsyncHandler(CommentController.deleteAllComments)
);

router.patch(
  "/update/:id",
  verifyAccessToken,
  authorize("ADMIN"),
  expressAsyncHandler(CommentController.updateComment)
);

router.get(
  "/:id",
  verifyAccessToken,
  authorize("ADMIN"),
  expressAsyncHandler(CommentController.getOneComment)
);

module.exports = {
  commentAdminRoutes: router,
};
