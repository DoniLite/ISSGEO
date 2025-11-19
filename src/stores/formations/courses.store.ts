/** biome-ignore-all lint/correctness/useHookAtTopLevel: - */
import type { BaseStore, PaginatedStore } from "../base.store";
import { useStoreAsyncOperations } from "@/lib/table/hooks/store/useStoreAsyncOperations";
import { apiClient } from "@/hooks/fetch-api";
import { useTableServerPaginationHandler } from "@/lib/table/hooks/useTableServerPaginationHandler";
import type {
	KeyCompetencyTableType,
	ModuleTableType,
	ThematicTableType,
	TrainingTableType,
} from "@/db";
import type { PaginationQuery } from "@/lib/interfaces/pagination";
import { useCallback } from "react";
import type {
	CreateCourseDTO,
	UpdateCourseDTO,
} from "@/api/formations/DTO/courses.dto";
import type { EntityStatistics } from "@/core/base.repository";

interface CoursesStore extends BaseStore {
	create: (data: CreateCourseDTO) => Promise<TrainingTableType | undefined>;
	deleteOne: (id: string) => Promise<void>;
	deleteMultiple: (ids: string[]) => Promise<void>;
	update: (id: string, data: UpdateCourseDTO) => Promise<void>;
	findOne: (id: string) => Promise<TrainingTableType | undefined>;
	stats: () => Promise<EntityStatistics | undefined>;
}

export default function useCoursesStore(): CoursesStore &
	PaginatedStore<
		TrainingTableType & {
			modules: ModuleTableType[];
			competencies: KeyCompetencyTableType[];
			thematic?: ThematicTableType;
		}
	> {
	const { loading, error, withAsyncOperation, resetState } =
		useStoreAsyncOperations();

	const refetchFunction = useCallback(async (query: PaginationQuery) => {
		const res = await apiClient.call("courses", "/courses", "GET", {
			params: query,
		});
		return res.data;
	}, []);

	const paginationHandler = useTableServerPaginationHandler<
		TrainingTableType & {
			modules: ModuleTableType[];
			competencies: KeyCompetencyTableType[];
			thematic?: ThematicTableType;
		},
		PaginationQuery
	>({
		refetchFunction,
	});

	const fetchData = withAsyncOperation(
		async (newQuery: Partial<PaginationQuery> = {}) => {
			await paginationHandler.fetchData(newQuery);
		},
	);

	const create = withAsyncOperation(async (data: CreateCourseDTO) => {
		const res = await apiClient.call("courses", "/courses", "POST", {
			body: data,
		});
		const newJob = res.data;
		paginationHandler.handlePostCreate({
			...newJob,
			modules: [],
			competencies: [],
		});
		return newJob;
	});

	const update = withAsyncOperation(
		async (id: string, data: UpdateCourseDTO) => {
			const res = await apiClient.call("courses", "/courses/:id", "PATCH", {
				body: data,
				params: { id },
			});
			if (res.status >= 200 && res.status < 300) {
				paginationHandler.handlePostUpdatePartial(id, data);
			}
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
		goToPage,
		updateFilters,
		updatePageSize,
		resetFilters: paginationHandler.resetFilters,
	};
}
