import { webFactory } from "@/factory/web.factory";
import courseApp from "./formations/app/course.app";
import userApp from "./user/app/user.app";
import sessionApp from "./formations/app/session.app";
import thematicApp from "./formations/app/thematic.app";
import contactApp from "./contact/app/contact.app";
import testimonialsApp from "./testimonials/app/testimonials.app";
import jobApp from "./job/app/job.app";
import rollingApp from "./rolling/app/rolling.app";
import checkoutApp from "./checkout/app/checkout.app";
import ogApp from "./og/app/og.app";

const api = webFactory.createApp();

api.route("/courses", courseApp);
api.route("/users", userApp);
api.route("/session", sessionApp);
api.route("/thematic", thematicApp);
api.route("/contact", contactApp);
api.route("/testimonials", testimonialsApp);
api.route("/job", jobApp);
api.route("/rolling", rollingApp);
api.route("/checkout", checkoutApp);
api.route("/og", ogApp);

export default api;
