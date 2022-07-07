const express = require("express");
const userController = require("../controllers/users");
const middlewareController = require("../controllers/middlewareController");

const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get(
  "/",
  middlewareController.verifyToken,
  userController.getAllUsers
);
userRouter.delete(
  "/delete/:id",
  middlewareController.verifyToken_delete,
  userController.deleteUser
);

userRouter.post("/refresh", userController.requestRefeshToken);

userRouter.post(
  "/logout",
  middlewareController.verifyToken,
  userController.logout
);

module.exports = userRouter;
