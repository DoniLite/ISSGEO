import { UserController } from "../web/user.controller";

const userController = new UserController();
const app = userController.getApp();

export default app;
