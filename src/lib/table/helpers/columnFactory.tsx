// src/lib/datatable/columnFactory.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type BaseRow = Record<string, unknown>;

interface ColumnOptions<T> {
	id: string;
	label?: string;
	sortable?: boolean;
	accessor: (row: T) => keyof T;
}

/** Génère une colonne simple */
export function createColumn<T extends BaseRow>({
	id,
	label,
	sortable,
	accessor,
}: ColumnOptions<T>): ColumnDef<T> {
	return {
		id,
		accessorFn: accessor,
		header: ({ column }) => {
			if (!sortable) return label;
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="flex items-center gap-2"
				>
					{label}
					<ArrowUpDown className="w-4 h-4" />
				</Button>
			);
		},
		cell: ({ getValue }) => <span>{String(getValue() ?? "")}</span>,
	};
}

/** Fabrique un ensemble de colonnes à partir d’une config déclarative */
export function buildColumns<T extends BaseRow>(
	config: ColumnOptions<T>[],
): ColumnDef<T>[] {
	return config.map((opt) => createColumn<T>(opt));
}
