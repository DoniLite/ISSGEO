/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: <> */
import EntityEditDialog from "@/components/shared/AppDialog";
import { Button } from "@/components/ui/button";
import type { TrainingSessionTableType } from "@/db";
import FlexTable, { type Emits } from "@/lib/table/FlexTable";
import {
	createActionsColumn,
	createDateColumn,
	createSelectColumn,
	createTextColumn,
} from "@/lib/table/helpers/columnFactory";
import { useEntityEditor } from "@/lib/table/hooks/forms/useEntityEditor";
import { useDefaultTableHandlers } from "@/lib/table/hooks/useTableServerFilters";
import type {
	ColumnDef,
	ColumnFilter,
	SortingState,
	Table,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
// import JobForm from '../components/JobForm';
import DeleteAlertDialog from "@/components/shared/ConfirDeleteDialog";
import Layout from "../Layout";
import z from "zod";
import GenericForm, {
	type GenericFormField,
} from "@/components/shared/entity/GenericForm";
import type {
	CreateSessionDTO,
	UpdateSessionDTO,
} from "@/api/formations/DTO/session.dto";
import useSessionStore from "@/stores/formations/session.store";
import useCoursesStore from "@/stores/formations/courses.store";

export default function CalendarPage() {
	const store = useSessionStore();
	const courseStore = useCoursesStore();
	const { items, fetchData } = store;
	const { t } = useTranslation();

	const computedCourses = useMemo(() => courseStore.items, [courseStore.items]);

	useEffect(() => {
		fetchData();
		courseStore.fetchData();
	}, []);

	const {
		handlePageUpdate,
		handlePageSizeUpdate,
		handleSortingUpdate,
		handleFiltersUpdate,
	} = useDefaultTableHandlers(store);

	const {
		entityModel,
		openDialog,
		onOpenDialog,
		editionMode,
		modalDescription,
		modalTitle,
		showDeleteDialog,
		onShowDeleteDialog,
		selectedIds,
		closeDialog,
		openCreateDialog,
		openUpdateDialog,
		onSave,
		confirmDelete,
		onDeleteTrigger,
	} = useEntityEditor<
		CreateSessionDTO,
		UpdateSessionDTO,
		TrainingSessionTableType
	>(store);

	const columns: ColumnDef<TrainingSessionTableType>[] = [
		createSelectColumn(t),
		createTextColumn(t, {
			accessorKey: "location",
			headerKey: "common.location",
			className: "lg:max-w-xs line-clamp-2 max-w-[12rem]",
		}),
		createTextColumn(t, {
			accessorKey: "startDate",
			headerKey: "common.startDate",
			className: "ml-4",
		}),
		createDateColumn(t, {
			accessorKey: "createdAt",
			headerKey: "common.createdAt",
		}),
		createActionsColumn({
			onDelete: onDeleteTrigger,
			onEdit: openUpdateDialog,
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

	const sessionFormSchema = z.object({
		startDate: z.iso.date(),
		location: z.string().min(2, {
			error: t("admin.session.form.location"),
		}),
		moduleId: z.string(),
	});

	const fields: GenericFormField<TrainingSessionTableType>[] = [
		{
			name: "startDate",
			label: t("admin.session.form.label.startDate"),
			type: "date",
			required: true,
		},
		{
			name: "location",
			label: t("common.location"),
			type: "text",
			required: true,
		},
		{
			name: "moduleId",
			label: t("admin.session.form.label.moduleId"),
			type: "combobox",
			entries: computedCourses.map((c) => ({
				label: c.title,
				id: c.id as string,
			})),
			required: true,
		},
	];

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
			/>
			<EntityEditDialog
				title={modalTitle}
				description={modalDescription}
				open={openDialog}
				onOpenChange={onOpenDialog}
				contentSlot={
					<GenericForm
						schema={sessionFormSchema}
						fields={fields}
						entity={entityModel}
						editionMode={editionMode}
						onSubmit={onSave}
						onCancel={closeDialog}
					/>
				}
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

const TableAssets = <T extends Record<string, unknown>>({
	openCreateDialog,
}: {
	table: Table<T>;
	openCreateDialog: () => void;
}) => {
	const { t } = useTranslation();
	return (
		<div className="w-full flex justify-between items-center">
			<h1
				className="text-lg font-bold lg:text-2xl"
				data-testid="organizations-title"
			>
				{t("admin.session.id")}
			</h1>
			<Button
				variant="default"
				data-testid="add-organization-btn"
				onClick={openCreateDialog}
			>
				<Plus />
				{t("common.add")}
			</Button>
		</div>
	);
};
