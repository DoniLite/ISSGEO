import type { CreateCheckoutDTO, UpdateCheckoutDTO } from '@/api/checkout';
import type { CreateContactDTO } from '@/api/contact';
import type {
	CreateCourseDTO,
	UpdateCourseDTO,
} from '@/api/formations/DTO/courses.dto';
import type {
	CreateKeyCompetencyDTO,
	UpdateKeyCompetencyDTO,
} from '@/api/formations/DTO/keyCompetency.dto';
import type {
	CreateModuleTDO,
	UpdateModuleDTO,
} from '@/api/formations/DTO/modules.dto';
import type {
	CreateSessionDTO,
	UpdateSessionDTO,
} from '@/api/formations/DTO/session.dto';
import type {
	CreateThematicDTO,
	UpdateThematicDTO,
} from '@/api/formations/DTO/thematic.dto';
import type { CreateJobDTO, UpdateJobDTO } from '@/api/job';
import type { CreateRollingDTO, UpdateRollingDTO } from '@/api/rolling';
import type { CreateTestimonialDTO } from '@/api/testimonials';
import type { CreateUserDto, LoginDTO, UpdateUserDto } from '@/api/user';
import type { EntityStatistics } from '@/core/base.repository';
import type {
	ContactTableType as Contact,
	UserTableType as User,
	TestimonialsTableType as Testimonials,
	JobOfferTableType as Job,
	TrainingTableType as Course,
	KeyCompetencyTableType as KeyCompetency,
	ThematicTableType as Thematic,
	TrainingSessionTableType as Session,
	ModuleTableType as Module,
	RollingTableType as Rolling,
	CheckoutTableType as Checkout,
} from '@/db';
import type {
	PaginatedResponse,
	PaginationQuery,
} from '@/lib/interfaces/pagination';

export interface ApiResponse<T = unknown> {
	data: T;
	status: number;
	message?: string;
}

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public code?: string,
	) {
		super(message);
		this.name = 'ApiError';
	}
}

export interface ApiErrorInterface {
	message: string;
	status: number;
	code?: string;
}

export interface RouteDefinition {
	method: HttpMethod;
	response: unknown;
	params?: Record<string, unknown>;
	body?: unknown;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
	method?: HttpMethod;
	headers?: Record<string, string>;
	body?: unknown;
	params?: Record<string, unknown>;
	forceQueries?: boolean
}

export interface UseApiState<T> {
	data: T;
	loading: boolean;
	error: ApiError | null;
}

export interface UseApiReturn<T> extends UseApiState<T> {
	refetch: () => Promise<void>;
	mutate: (newData: T) => void;
}

interface DefaultPatchResponse {
	updated: boolean;
	rows: number;
}

interface DefaultDeleteResponse {
	deleted: boolean;
}

type DeleteMultipleBody = { ids: string[] };

export interface ApiRoutes {
	session: {
		'/session': {
			GET: {
				response: PaginatedResponse<Session & { module: Course | undefined }>;
				params: PaginationQuery;
			};
			POST: {
				response: Session;
				body: CreateSessionDTO;
			};
			DELETE: {
				body: DeleteMultipleBody;
				response: number;
			};
		};
		'/session/:id': {
			PATCH: {
				response: DefaultPatchResponse;
				body: UpdateSessionDTO;
				params: { id: Session['id'] };
			};
			DELETE: {
				params: { id: Session['id'] };
				response: DefaultDeleteResponse;
			};
		};
		'session/all': {
			GET: {
				response: (Session & { module: Course | undefined })[];
				params: Record<string, unknown>;
			};
		};
	};
	thematic: {
		'/thematic': {
			GET: {
				response: PaginatedResponse<Thematic>;
				params: PaginationQuery;
			};
			POST: {
				response: Thematic;
				body: CreateThematicDTO;
			};
			DELETE: {
				body: DeleteMultipleBody;
				response: number;
			};
		};
		'/thematic/:id': {
			GET: {
				response: Thematic;
				params: {
					id: Thematic['id'];
				};
			};
			PATCH: {
				response: DefaultPatchResponse;
				body: UpdateThematicDTO;
				params: { id: Thematic['id'] };
			};
			DELETE: {
				params: { id: Thematic['id'] };
				response: DefaultDeleteResponse;
			};
		};
		'/thematic/all': {
			GET: {
				response: Thematic[];
				params: Record<string, unknown>;
			};
		};
	};
	courses: {
		'/courses': {
			GET: {
				response: PaginatedResponse<Course>;
				params: PaginationQuery;
			};
			POST: {
				response: Course;
				body: CreateCourseDTO;
			};
			DELETE: {
				body: DeleteMultipleBody;
				response: number;
			};
		};
		'/courses/stats': {
			GET: {
				response: EntityStatistics;
			};
		};
		'/courses/:id': {
			GET: {
				response: Course;
				params: {
					id: Course['id'];
				};
			};
			PATCH: {
				response: DefaultPatchResponse;
				body: UpdateCourseDTO;
				params: { id: Course['id'] };
			};
			DELETE: {
				params: { id: Course['id'] };
				response: DefaultDeleteResponse;
			};
		};
		'/courses/key-competency': {
			GET: {
				response: PaginatedResponse<KeyCompetency>;
				params: PaginationQuery;
			};
			POST: {
				response: KeyCompetency;
				body: CreateKeyCompetencyDTO;
			};
			DELETE: {
				body: DeleteMultipleBody;
				response: number;
			};
		};
		'/courses/key-competency/:id': {
			PATCH: {
				response: DefaultPatchResponse;
				body: UpdateKeyCompetencyDTO;
				params: { id: KeyCompetency['id'] };
			};
			DELETE: {
				params: { id: KeyCompetency['id'] };
				response: DefaultDeleteResponse;
			};
		};
		'/courses/key-competency/all': {
			GET: {
				response: KeyCompetency[];
				params: PaginationQuery;
			};
		};

		'/courses/module': {
			GET: {
				response: PaginatedResponse<Module>;
				params: PaginationQuery;
			};
			POST: {
				response: Module;
				body: CreateModuleTDO;
			};
			DELETE: {
				body: DeleteMultipleBody;
				response: number;
			};
		};
		'/courses/module/:id': {
			PATCH: {
				response: DefaultPatchResponse;
				body: UpdateModuleDTO;
				params: { id: Module['id'] };
			};
			DELETE: {
				params: { id: Module['id'] };
				response: DefaultDeleteResponse;
			};
		};
		'/courses/module/all': {
			GET: {
				response: Module[];
				params: PaginationQuery;
			};
		};
	};
	users: {
		'/users': {
			GET: {
				response: PaginatedResponse<User>;
				params: PaginationQuery;
			};
			POST: {
				response: User;
				body: CreateUserDto;
			};
			DELETE: {
				body: DeleteMultipleBody;
				response: number;
			};
		};
		'/users/stats': {
			GET: {
				response: EntityStatistics;
			};
		};
		'/users/login': {
			POST: {
				body: LoginDTO;
				response: Pick<User, 'id' | 'name' | 'email' | 'image'>;
			};
		};
		'/users/logout': {
			GET: {
				response: { authenticated: false };
			};
		};
		'/users/:id': {
			PATCH: {
				response: DefaultPatchResponse;
				body: UpdateUserDto;
				params: { id: User['id'] };
			};
			DELETE: {
				params: { id: User['id'] };
				response: DefaultDeleteResponse;
			};
		};
		'/users/me': {
			GET: {
				response:
					| Pick<User, 'id' | 'email' | 'name' | 'image'>
					| { authenticated: false; code?: number; message?: string };
			};
		};
	};
	contact: {
		'/contact': {
			GET: {
				response: PaginatedResponse<Contact>;
				params: PaginationQuery;
			};
			POST: {
				response: Contact;
				body: CreateContactDTO;
			};
			DELETE: {
				body: DeleteMultipleBody;
				response: number;
			};
		};
		'/contact/stats': {
			GET: {
				response: EntityStatistics;
			};
		};
		'/contact/:id': {
			DELETE: {
				params: { id: Contact['id'] };
				response: DefaultDeleteResponse;
			};
		};
	};
	testimonials: {
		'/testimonials': {
			GET: {
				response: PaginatedResponse<Testimonials>;
				params: PaginationQuery;
			};
			POST: {
				response: Contact;
				body: CreateTestimonialDTO;
			};
			DELETE: {
				body: DeleteMultipleBody;
				response: number;
			};
		};
		'/testimonials/stats': {
			GET: {
				response: EntityStatistics;
			};
		};
		'/testimonials/:id': {
			DELETE: {
				params: { id: Testimonials['id'] };
				response: DefaultDeleteResponse;
			};
		};
	};
	job: {
		'/job': {
			GET: {
				response: PaginatedResponse<Job>;
				params: PaginationQuery;
			};
			POST: {
				response: Job;
				body: CreateJobDTO;
			};
			DELETE: {
				body: DeleteMultipleBody;
				response: number;
			};
		};
		'/job/:id': {
			DELETE: {
				params: { id: Job['id'] };
				response: DefaultDeleteResponse;
			};
			PATCH: {
				response: DefaultPatchResponse;
				body: UpdateJobDTO;
				params: { id: Job['id'] };
			};
		};
	};
	rolling: {
		'/rolling': {
			GET: {
				response: PaginatedResponse<Rolling>;
				params: PaginationQuery;
			};
			POST: {
				response: Rolling;
				body: CreateRollingDTO;
				params: { ids: string };
			};
			DELETE: {
				body: DeleteMultipleBody;
				response: number;
			};
		};
		'/rolling/:id': {
			DELETE: {
				params: { id: Rolling['id'] };
				response: DefaultDeleteResponse;
			};
			PATCH: {
				response: DefaultPatchResponse;
				body: UpdateRollingDTO;
				params: { id: Rolling['id'] };
			};
		};
	};
	checkout: {
		'/checkout': {
			GET: {
				response: PaginatedResponse<Checkout>;
				params: PaginationQuery;
			};
			POST: {
				response: Checkout;
				body: CreateCheckoutDTO;
			};
			DELETE: {
				body: DeleteMultipleBody;
				response: number;
			};
		};
		'/checkout/:id': {
			DELETE: {
				params: { id: Checkout['id'] };
				response: DefaultDeleteResponse;
			};
			PATCH: {
				response: DefaultPatchResponse;
				body: UpdateCheckoutDTO;
				params: { id: Checkout['id'] };
			};
		};
	};
}

// Utilitaires de types
export type ExtractResponse<T> = T extends { response: infer R } ? R : never;
export type ExtractParams<T> = T extends { params: infer P } ? P : never;
export type ExtractBody<T> = T extends { body: infer B } ? B : never;

export type RouteKey = keyof ApiRoutes;
export type PathKey<R extends RouteKey> = keyof ApiRoutes[R];
export type MethodKey<
	R extends RouteKey,
	P extends PathKey<R>,
> = keyof ApiRoutes[R][P];

export type RouteEndpoint<
	R extends RouteKey,
	P extends PathKey<R>,
	M extends MethodKey<R, P>,
> = ApiRoutes[R][P][M];
