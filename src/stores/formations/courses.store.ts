import type { BaseStore, PaginatedStore } from "../base.store";
import { useStoreAsyncOperations } from "@/lib/table/hooks/store/useStoreAsyncOperations";
import { apiClient } from "@/lib/fetch-api";
import { useTableServerPaginationHandler } from "@/lib/table/hooks/useTableServerPaginationHandler";
import type { PaginationQuery } from "@/lib/interfaces/pagination";
import { useCallback } from "react";
import type {
	CreateCourseDTO,
	UpdateCourseDTO,
} from "@/api/formations/DTO/courses.dto";
import type { EntityStatistics } from "@/core/base.repository";
import type { CourseResponse } from "@/lib/interfaces/response/course.response";
import type {
	KeyCompetencyTableType,
	ModuleTableType,
} from "@/db/schema/types";

interface ParamsQuery {
	moduleIds?: string[];
	competencyIds?: string[];
}

interface CoursesStore extends BaseStore {
	create: (
		data: CreateCourseDTO,
		options?: ParamsQuery,
	) => Promise<CourseResponse | undefined>;
	deleteOne: (id: string) => Promise<void>;
	deleteMultiple: (ids: string[]) => Promise<void>;
	update: (id: string, data: UpdateCourseDTO) => Promise<void>;
	findOne: (id: string) => Promise<CourseResponse | undefined>;
	stats: () => Promise<EntityStatistics | undefined>;
	updateCourseCompetencies: (
		courseId: string,
		competencyIds: string[],
	) => Promise<
		| {
				updated: boolean;
				rows: Array<
					CourseResponse & {
						competencies?: KeyCompetencyTableType[];
					}
				>;
		  }
		| undefined
	>;
	updateCourseModules: (
		courseId: string,
		moduleIds: string[],
	) => Promise<
		| {
				updated: boolean;
				rows: Array<
					CourseResponse & {
						modules?: ModuleTableType[];
					}
				>;
		  }
		| undefined
	>;
}

export default function useCoursesStore(): CoursesStore &
	PaginatedStore<CourseResponse> {
	const { loading, error, withAsyncOperation, resetState } =
		useStoreAsyncOperations();

	const refetchFunction = useCallback(async (query: PaginationQuery) => {
		const res = await apiClient.call("courses", "/courses", "GET", {
			params: query,
		});
		return res.data;
	}, []);

	const paginationHandler = useTableServerPaginationHandler<
		CourseResponse,
		PaginationQuery
	>({
		refetchFunction,
		initialQuery: { populateChildren: true },
	});

	const fetchData = withAsyncOperation(
		async (newQuery: Partial<PaginationQuery> = {}) => {
			await paginationHandler.fetchData(newQuery);
		},
	);

	const create = withAsyncOperation(
		async (data: CreateCourseDTO, options?: ParamsQuery) => {
			const res = await apiClient.call("courses", "/courses", "POST", {
				body: data,
				params: {
					moduleIds: options?.moduleIds?.join(",") || "",
					competencyIds: options?.competencyIds?.join(",") || "",
				},
				forceQueries: true,
			});
			const newJob = res.data;
			paginationHandler.handlePostCreate(newJob);
			return newJob;
		},
	);

	const update = withAsyncOperation(
		async (id: string, data: UpdateCourseDTO) => {
			const res = await apiClient.call("courses", "/courses/:id", "PATCH", {
				body: data,
				params: {
					id,
				},
				forceQueries: true,
			});
			if (res.status >= 200 && res.status < 300) {
				paginationHandler.handlePostUpdatePartial(id, data);
			}
		},
	);

	const updateCourseCompetencies = withAsyncOperation(
		async (courseId: string, competencyIds: string[]) => {
			const res = await apiClient.call(
				"courses",
				"/courses/update-course-competencies/:id",
				"PATCH",
				{
					params: { id: courseId, competencyIds: competencyIds.join(",") },
					forceQueries: true,
				},
			);
			return res.data;
		},
	);

	const updateCourseModules = withAsyncOperation(
		async (courseId: string, moduleIds: string[]) => {
			const res = await apiClient.call(
				"courses",
				"/courses/update-course-modules/:id",
				"PATCH",
				{
					params: { id: courseId, moduleIds: moduleIds.join(",") },
					forceQueries: true,
				},
			);
			return res.data;
		},
	);

	const findOne = withAsyncOperation(async (id: string) => {
		const { data } = await apiClient.call("courses", "/courses/:id", "GET", {
			params: { id },
		});

		return data;
	});

	const deleteOne = withAsyncOperation(async (id: string) => {
		await apiClient.call("courses", "/courses/:id", "DELETE", {
			params: { id },
		});

		paginationHandler.handleBulkDelete([id]);
	});

	const deleteMultiple = withAsyncOperation(async (ids: string[]) => {
		await apiClient.call("courses", "/courses", "DELETE", {
			body: { ids },
		});

		paginationHandler.handleBulkDelete(ids);
	});

	const goToPage = withAsyncOperation(async (page: number) => {
		await paginationHandler.goToPage(page);
	});

	const updatePageSize = withAsyncOperation(async (pageSize: number) => {
		await paginationHandler.updatePageSize(pageSize);
	});

	const updateFilters = withAsyncOperation(
		async (filters: Partial<PaginationQuery>) => {
			await paginationHandler.updateFilters(filters);
		},
	);

	const stats = withAsyncOperation(async () => {
		const { data } = await apiClient.call("courses", "/courses/stats", "GET");
		return data;
	});

	return {
		loading,
		error,
		resetState,
		items: paginationHandler.items,
		allItems: paginationHandler.allItems,
		query: paginationHandler.query,
		pagination: paginationHandler.pagination,
		defaultEntity: {
			totalDuration: 0,
			title: "",
			description: "",
			priceMin: 0,
			priceMax: 0,
			modules: [],
			competencies: [],
		},
		translationPath: "admin.formations",

		fetchData,
		create,
		stats,
		deleteOne,
		deleteMultiple,
		findOne,
		update,
		updateCourseCompetencies,
		updateCourseModules,
		goToPage,
		updateFilters,
		updatePageSize,
		resetFilters: paginationHandler.resetFilters,
	};
}
