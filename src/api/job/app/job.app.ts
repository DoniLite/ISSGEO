import { JobController } from "../web/job.controller";

const jobController = new JobController();
const app = jobController.getApp();

export default app;
