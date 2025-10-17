import { ContactService } from '@/api/contact/service/contact.service';
import { CourseService } from '@/api/formations/services/courses.service';
import { SessionService } from '@/api/formations/services/session.service';
import { ThematicService } from '@/api/formations/services/thematic.service';
import { JobService } from '@/api/job/service/job.service';
import { TestimonialsService } from '@/api/testimonials/service/testimonials.service';
import { UserService } from '@/api/user/services/user.service';

// biome-ignore lint/complexity/noStaticOnlyClass: This class don't need to be initiated
export class ServiceFactory {
  private static instances = new Map();

  static getService<T, A>(
    serviceClass: new (...args: A[]) => T,
    ...makers: A[]
  ): T {
    if (!ServiceFactory.instances.has(serviceClass)) {
      ServiceFactory.instances.set(serviceClass, new serviceClass(...makers));
    }
    return ServiceFactory.instances.get(serviceClass);
  }

  static getCourseService(): CourseService {
    return ServiceFactory.getService(CourseService);
  }

  static getUserService(): UserService {
    return ServiceFactory.getService(UserService);
  }

  static getSessionService(): SessionService {
    return ServiceFactory.getService(SessionService);
  }

  static getThematicService(): ThematicService {
    return ServiceFactory.getService(ThematicService);
  }

  static getContactService(): ContactService {
    return ServiceFactory.getService(ContactService);
  }

  static getTestimonialService(): TestimonialsService {
    return ServiceFactory.getService(TestimonialsService);
  }

  static getJobService(): JobService {
    return ServiceFactory.getService(JobService);
  }
}
