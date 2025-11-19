import { cn } from "@/lib/utils";

interface EntityTitleProps {
	title: string;
	description?: string;
	titleClassName?: string;
	descriptionClassName?: string;
	hasDescription?: boolean;
}

export default function EntityTitle({
	title,
	description = "",
	titleClassName = "",
	descriptionClassName = "",
	hasDescription = true,
}: EntityTitleProps) {
	return (
		<div className="flex w-full flex-col">
			<span
				className={cn(
					"text-foreground truncate",
					titleClassName,
					hasDescription && "font-medium",
				)}
				data-testid="entity-title"
			>
				{title}
			</span>
			{description && (
				<span
					className={cn(
						"text-muted-foreground hidden w-full truncate sm:inline-block",
						descriptionClassName,
					)}
					data-testid="entity-description"
				>
					{description}
				</span>
			)}
		</div>
	);
}
