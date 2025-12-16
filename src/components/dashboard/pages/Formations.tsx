/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: <> */
import type { TrainingTableType } from "@/db";
import FlexTable, { type Emits } from "@/lib/table/FlexTable";
import {
	createActionsColumn,
	createDateColumn,
	createExpandRowColumn,
	createNameColumn,
	createSelectColumn,
	createTextColumn,
} from "@/lib/table/helpers/columnFactory";
import {
	useEntityEditor,
	type CrudCompatibleStore,
} from "@/lib/table/hooks/forms/useEntityEditor";
import { useDefaultTableHandlers } from "@/lib/table/hooks/useTableServerFilters";
import type {
	ColumnDef,
	ColumnFilter,
	SortingState,
	Table,
} from "@tanstack/react-table";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
// import JobForm from '../components/JobForm';
import DeleteAlertDialog from "@/components/shared/ConfirDeleteDialog";
import Layout from "../Layout";
import useCoursesStore from "@/stores/formations/courses.store";
import type {
	CreateCourseDTO,
	UpdateCourseDTO,
} from "@/api/formations/DTO/courses.dto";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import { GenericRowDetail } from "@/lib/table/components/GenericRowDetail";

export default function CoursesPage() {
	const store = useCoursesStore();
	const { items, fetchData } = store;
	const { t } = useTranslation();
	const navigate = useNavigate();

	useEffect(() => {
		fetchData();
	}, []);

	const {
		handlePageUpdate,
		handlePageSizeUpdate,
		handleSortingUpdate,
		handleFiltersUpdate,
	} = useDefaultTableHandlers(store);

	const {
		showDeleteDialog,
		onShowDeleteDialog,
		selectedIds,
		openCreateDialog,
		confirmDelete,
		onDeleteTrigger,
	} = useEntityEditor<CreateCourseDTO, UpdateCourseDTO, TrainingTableType>(
		store as CrudCompatibleStore<
			CreateCourseDTO,
			UpdateCourseDTO,
			TrainingTableType
		>,
	);

	const columns: ColumnDef<TrainingTableType>[] = [
		createSelectColumn(t),
		createNameColumn(t),
		createTextColumn<TrainingTableType, TrainingTableType>(t, {
			headerKey: "common.price",
			accessorKey: "priceMin",
			selfAccessor: true,
			className: "ml-2",
			getEntityValue(entity) {
				return <span>{`${entity.priceMin} ~ ${entity.priceMax}`}</span>;
			},
		}),
		createTextColumn(t, {
			headerKey: "common.participants",
			accessorKey: "participants",
			className: "flex justify-center mr-3",
		}),
		createTextColumn(t, {
			headerKey: "common.enrolled",
			accessorKey: "enrolled",
			className: "flex justify-center mr-3",
		}),
		createTextColumn<TrainingTableType, string>(t, {
			headerKey: "common.details",
			accessorKey: "id",
			getEntityValue(entity) {
				return (
					<Button
						className="flex items-center gap-2 rounded-lg cursor-pointer"
						variant={"ghost"}
						onClick={() => {
							navigate({
								to: "/admin/courses/rolling/$courseId",
								params: { courseId: entity },
							});
						}}
					>
						{t("common.details")}
						<ArrowRight className="w-3 h-3" />
					</Button>
				);
			},
		}),
		createExpandRowColumn(t),	
		createDateColumn(t, {
			accessorKey: "createdAt",
			headerKey: "common.createdAt",
		}),
		createActionsColumn({
			onDelete: onDeleteTrigger,
			onEdit: (e) => {
				navigate({
					to: "/admin/courses/form",
					search: {
						courseId: e.id,
					},
				});
			},
		}),
	];

	const handleEmit: Emits = (type, payload) => {
		if (type === "update:page") {
			handlePageUpdate(payload as number);
		} else if (type === "update:pageSize") {
			handlePageSizeUpdate(payload as number);
		} else if (type === "update:filters") {
			handleFiltersUpdate(payload as ColumnFilter[]);
		} else {
			handleSortingUpdate(payload as SortingState);
		}
	};

	return (
		<Layout>
			<FlexTable
				data={items}
				columns={columns}
				serverSidePagination={store.pagination}
				emit={handleEmit}
				assets={(props) => (
					<TableAssets
						openCreateDialog={openCreateDialog}
						table={props.table}
					/>
				)}
				tableContentComponent={(props) => <GenericRowDetail {...props} />}
			/>
			<DeleteAlertDialog
				open={showDeleteDialog}
				onOpenChange={onShowDeleteDialog}
				onConfirm={confirmDelete}
				selectedCount={selectedIds.length}
			/>
		</Layout>
	);
}

const TableAssets = <T extends Record<string, unknown>>(_: {
	table: Table<T>;
	openCreateDialog: () => void;
}) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	return (
		<div className="w-full flex justify-between items-center">
			<h1
				className="text-lg font-bold lg:text-2xl"
				data-testid="organizations-title"
			>
				{t("admin.formations.id")}
			</h1>
			<Button
				variant="default"
				data-testid="add-organization-btn"
				onClick={() => {
					navigate({
						to: "/admin/courses/form",
						search: { courseId: undefined },
					});
				}}
			>
				<Plus />
				{t("common.add")}
			</Button>
		</div>
	);
};
