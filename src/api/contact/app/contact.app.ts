import { ContactsController } from "../web/contact.controller";

const contactController = new ContactsController();
const app = contactController.getApp();

export default app;
