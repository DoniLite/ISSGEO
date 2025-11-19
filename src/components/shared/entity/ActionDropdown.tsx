import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EntityActionsMenuProps<T extends { id?: string }> {
	canEdit?: boolean;
	canDelete?: boolean;
	entity: T;
	onEdit?: (entity: T) => void;
	onDelete?: (id: string) => void;
}

export default function EntityActionsMenu<T extends { id?: string }>({
	canEdit = true,
	canDelete = true,
	entity,
	onEdit,
	onDelete,
}: EntityActionsMenuProps<T>) {
	const { t } = useTranslation();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					disabled={!canEdit && !canDelete}
					variant="ghost"
					className="h-8 w-8 p-0"
					data-testid="actions-dropdown"
				>
					<EllipsisVertical className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{canEdit && (
					<DropdownMenuItem
						asChild
						data-testid="edit-menu-item"
						onClick={() => onEdit?.(entity)}
					>
						<Button
							variant="ghost"
							className="mb-1 flex h-[99%] w-full cursor-pointer justify-start"
						>
							{t("common.edit")}
						</Button>
					</DropdownMenuItem>
				)}

				{canDelete && (
					<DropdownMenuItem
						asChild
						data-testid="delete-menu-item"
						onClick={() => onDelete?.(entity.id ?? "")}
					>
						<Button
							variant="ghost"
							className="text-destructive focus:text-destructive dark:focus:text-destructive flex h-[99%] w-full cursor-pointer justify-start"
						>
							{t("common.delete")}
						</Button>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
