import EntityEditDialog from "@/components/shared/AppDialog";
import { Button } from "@/components/ui/button";
import type { MasterTableType } from "@/db";
import FlexTable, { type Emits } from "@/lib/table/FlexTable";
import {
	createActionsColumn,
	createDateColumn,
	createExpandRowColumn,
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
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
// import JobForm from '../components/JobForm';
import DeleteAlertDialog from "@/components/shared/ConfirDeleteDialog";
import Layout from "../Layout";
import z from "zod";
import GenericForm, {
	type GenericFormField,
} from "@/components/shared/entity/GenericForm";
import useMasterStore from "@/stores/formations/master.store";
import type { CreateMasterDTO, UpdateMasterDTO } from "@/api/formations";
import { GenericRowDetail } from "@/lib/table/components/GenericRowDetail";

export default function MasterPage() {
	const store = useMasterStore();
	const { items, fetchData } = store;
	const { t } = useTranslation();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
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
	} = useEntityEditor<CreateMasterDTO, UpdateMasterDTO, MasterTableType>(store);

	const columns: ColumnDef<MasterTableType>[] = [
		createSelectColumn(t),
		createTextColumn(t, {
			accessorKey: "name",
			headerKey: "common.name",
			className: "lg:max-w-xs line-clamp-2 max-w-[12rem]",
		}),
		createTextColumn(t, {
			accessorKey: "description",
			headerKey: "common.description",
			className: "lg:max-w-xs line-clamp-2 max-w-[12rem]",
		}),
		createExpandRowColumn(t),
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

	const masterFormSchema = z.object({
		name: z.string().min(2, {
			error: t("admin.master.form.name"),
		}),
		description: z.string().min(2, {
			error: t("admin.master.form.description"),
		}),
		image: z
			.string({
				error: t("admin.master.form.image"),
			})
			.nullable(),
		socials: z
			.object({
				facebook: z.string().optional().nullable(),
				twitter: z.string().optional().nullable(),
				instagram: z.string().optional().nullable(),
				linkedin: z.string().optional().nullable(),
			})
			.optional()
			.nullable(),
	});

	const fields: GenericFormField<MasterTableType>[] = [
		{
			name: "image",
			label: t("common.image"),
			type: "image",
			required: true,
		},
		{ name: "name", label: t("common.name"), type: "text", required: true },
		{
			name: "description",
			label: t("common.description"),
			type: "textarea",
			required: true,
		},
		{
			// biome-ignore lint/suspicious/noExplicitAny: <>
			name: "socials.facebook" as any,
			label: t("admin.master.form.socials.facebook"),
			type: "text",
		},
		{
			// biome-ignore lint/suspicious/noExplicitAny: <>
			name: "socials.twitter" as any,
			label: t("admin.master.form.socials.twitter"),
			type: "text",
		},
		{
			// biome-ignore lint/suspicious/noExplicitAny: <>
			name: "socials.instagram" as any,
			label: t("admin.master.form.socials.instagram"),
			type: "text",
		},
		{
			// biome-ignore lint/suspicious/noExplicitAny: <>
			name: "socials.linkedin" as any,
			label: t("admin.master.form.socials.linkedin"),
			type: "text",
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
				tableContentComponent={(props) => (
					<GenericRowDetail
						excludedKeys={["createdAt", "updatedAt", "id", "image"]}
						{...props}
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
						schema={masterFormSchema}
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
				{t("admin.master.id")}
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
