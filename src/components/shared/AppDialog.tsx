import { type ReactNode, useCallback } from "react";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	Dialog,
} from "@/components/ui/dialog";

interface DialogProps {
	title: string;
	description?: string;
	contentClassName?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	headerSlot?: ReactNode;
	contentSlot?: ReactNode;
}

export const EntityEditDialog: React.FC<DialogProps> = ({
	title,
	description,
	contentClassName,
	open,
	onOpenChange,
	headerSlot,
	contentSlot,
}) => {
	const handlePointerDownOutside = useCallback((event: Event) => {
		event.preventDefault();
		event.stopPropagation();
		return false;
	}, []);

	const handleInteractOutside = useCallback((event: Event) => {
		event.preventDefault();
		event.stopPropagation();
		return false;
	}, []);

	const handleEscapeKeyDown = useCallback((event: KeyboardEvent) => {
		event.preventDefault();
		return false;
	}, []);

	return (
		<Dialog open={open} onOpenChange={onOpenChange} modal>
			<DialogContent
				className={contentClassName}
				onPointerDownOutside={handlePointerDownOutside}
				onInteractOutside={handleInteractOutside}
				onEscapeKeyDown={handleEscapeKeyDown}
			>
				{headerSlot ? (
					headerSlot
				) : (
					<DialogHeader data-testid="entity-edit-dialog-header">
						<DialogTitle>{title}</DialogTitle>
						{description && (
							<DialogDescription>{description}</DialogDescription>
						)}
					</DialogHeader>
				)}
				{contentSlot}
			</DialogContent>
		</Dialog>
	);
};

export default EntityEditDialog;
