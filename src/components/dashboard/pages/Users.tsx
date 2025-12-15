import EntityEditDialog from "@/components/shared/AppDialog";
import type { EntryType } from "@/components/shared/entity/SortedCombobox";
import EntitySelect from "@/components/shared/entity/SortedCombobox";
import { Button } from "@/components/ui/button";
import type { UserTableType } from "@/db";
import FlexTable, { type Emits } from "@/lib/table/FlexTable";
import {
	createActionsColumn,
	createBadgeColumn,
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
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
// import JobForm from '../components/JobForm';
import DeleteAlertDialog from "@/components/shared/ConfirDeleteDialog";
import Layout from "../Layout";
import z from "zod";
import GenericForm, {
	type GenericFormField,
} from "@/components/shared/entity/GenericForm";
import useUsersStore from "@/stores/users.store";
import type { CreateUserDto, UpdateUserDto } from "@/api/user";

export default function UsersPage() {
	const store = useUsersStore();
	const { items, fetchData } = store;
	const { t } = useTranslation();
	const [contractFilter, setContractFilter] = useState("all");

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
	} = useEntityEditor<CreateUserDto, UpdateUserDto, UserTableType>(store);

	const columns: ColumnDef<UserTableType>[] = [
		createSelectColumn(t),
		createTextColumn(t, {
			accessorKey: "name",
			headerKey: "common.name",
			className: "lg:max-w-xs line-clamp-2 max-w-[12rem]",
		}),
		createTextColumn(t, {
			accessorKey: "email",
			headerKey: "common.email",
			className: "ml-4",
		}),
		createBadgeColumn(t, {
			accessorKey: "role",
			headerKey: "common.role",
			className(entity) {
				const base = "ml-1";
				if (entity.role === "admin") {
					return `${base} bg-orange-400`;
				}
				if (entity.role === "maintainer") {
					return `${base} bg-green-400`;
				}
				if (entity.role === "user") {
					return `${base} bg-pink-400`;
				}
				return `${base}`;
			},
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

	const userFormSchema = z.object({
		name: z.string().min(2, {
			error: t("admin.users.form.title"),
		}),
		email: z.email().min(2, {
			error: t("admin.users.form.location"),
		}),
		password: z.string().min(6, {
			error: t("admin.users.form.location"),
		}),
		role: z.enum(["user", "maintainer"]).nullable(),
	});

	const fields: GenericFormField<UserTableType>[] = [
		{ name: "name", label: t("common.name"), type: "text", required: true },
		{
			name: "email",
			label: t("common.email"),
			type: "text",
			required: true,
		},
		{
			name: "password",
			label: t("common.password"),
			type: "password",
			required: true,
		},
		{
			name: "role",
			label: t("common.role"),
			type: "select",
			options: Object.values(["user", "maintainer"] as const),
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
				tableFilters={(props) => (
					<TableFilters
						{...props}
						value={contractFilter}
						handleChange={(v) => {
							handleFiltersUpdate([{ id: "role", value: v }]);
							setContractFilter(v);
						}}
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
						schema={userFormSchema}
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

const TableFilters = <T extends Record<string, unknown>>({
	handleChange,
	value,
}: {
	table: Table<T>;
	value: string;
	handleChange: (v: string) => void;
}) => {
	const { t } = useTranslation();

	const contractTypeOptions = useMemo(
		() =>
			[
				{
					id: "all",
					label: t("common.all"),
				},
				...["user", "maintainer"].map((type) => ({
					id: type,
					label: t(`admin.users.form.roles.${type}`),
				})),
			] as EntryType[],
		[t],
	);

	return (
		<div className="w-full min-w-(--reka-dropdown-menu-trigger-width) lg:max-w-60">
			<EntitySelect
				value={value}
				entries={contractTypeOptions}
				placeholder={t("common.all")}
				onSelected={handleChange}
			/>
		</div>
	);
};

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
				{t("admin.users.id")}
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
