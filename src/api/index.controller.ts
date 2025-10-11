import { webFactory } from '@/factory/web.factory';
import courseApp from './formations/web/course.controller';
import userApp from './user/web/user.controller';
import sessionApp from './formations/web/session.controller';
import thematicApp from './formations/web/thematic.controller';
import contactApp from './contact/web/contact.controller';
import testimonialsApp from './testimonials/web/testimonials.controller';
import jobApp from './job/web/job.controller';

const api = webFactory.createApp();

api.route('/courses', courseApp);
api.route('/users', userApp);
api.route('/session', sessionApp);
api.route('/thematic', thematicApp);
api.route('/contact', contactApp);
api.route('/testimonials', testimonialsApp);
api.route('/job', jobApp);

export default api;
