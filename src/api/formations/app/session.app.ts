import { SessionController } from "../web/session.controller";

const sessionController = new SessionController();
const app = sessionController.getApp();

export default app;
