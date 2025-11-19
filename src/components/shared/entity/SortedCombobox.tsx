/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
import { useState, useMemo, useCallback, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export type EntryType = {
	id: string;
	label: ReactNode;
};

type EntitySelectProps<T extends boolean = false> = {
	entries: EntryType[];
	placeholder: string;
	multiple?: T;
	initialValue?: T extends true ? EntryType["id"][] : EntryType["id"];
	className?: string;
	searchInputDisabled?: boolean;
	value?: T extends true ? EntryType["id"][] : EntryType["id"];
	clearable?: boolean;
	onSelected?:
		| ((
				value: T extends true ? EntryType["id"][] : EntryType["id"],
		  ) => Promise<void>)
		| ((value: T extends true ? EntryType["id"][] : EntryType["id"]) => void);
	onSearch?: (query: string) => void;
};

export default function EntitySelect<T extends boolean = false>({
	entries,
	placeholder,
	multiple,
	initialValue,
	className,
	searchInputDisabled,
	value: controlledValue,
	clearable,
	onSelected,
	onSearch,
}: EntitySelectProps<T>) {
	const { t } = useTranslation();

	const [open, setOpen] = useState(false);
	const isControlled = controlledValue !== undefined;

	const internalValue = isControlled
		? (controlledValue as any)
		: ((initialValue as any) ?? (multiple ? [] : ""));

	const [uncontrolledValue, setUncontrolledValue] = useState(internalValue);

	const value = isControlled ? (controlledValue as any) : uncontrolledValue;
	const setValue = isControlled
		? (v: any) => onSelected?.(v)
		: setUncontrolledValue;

	const isSelected = useCallback(
		(id: string) => {
			if (multiple) {
				return (value as string[]).includes(id);
			}
			return value === id;
		},
		[value, multiple],
	);

	const hasSelection = useMemo(() => {
		if (multiple) {
			return (value as string[]).length > 0;
		}
		return value !== "" && value !== null && value !== undefined;
	}, [value, multiple]);

	const selectedEntry = useMemo(() => {
		if (multiple) {
			const selectedValues = value as string[];
			if (!selectedValues.length) {
				return placeholder;
			}

			if (selectedValues.length === 1) {
				const selected = entries.find((e) => e.id === selectedValues[0]);
				return selected?.label ?? placeholder;
			}

			return t("common.selectedItems", { count: selectedValues.length });
		} else {
			return entries.find((e) => e.id === value)?.label ?? placeholder;
		}
	}, [entries, value, multiple, placeholder, t]);

	const clearSelection = useCallback(
		(e?: React.SyntheticEvent) => {
			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}

			const newValue: any = multiple ? [] : "";
			setValue(newValue);
			onSelected?.(newValue);
		},
		[multiple, onSelected],
	);

	const toggleSelection = useCallback(
		(id: string) => {
			if (multiple) {
				const current = [...(value as string[])];
				const index = current.indexOf(id);
				if (index === -1) {
					current.push(id);
				} else {
					current.splice(index, 1);
				}

				setValue(current as any);

				if (onSelected) {
					onSelected(current as any);
				}
			} else {
				const newValue = value === id ? "" : id;
				setValue(newValue as any);
				if (onSelected) {
					onSelected(newValue as any);
				}
				setOpen(false);
			}
		},
		[controlledValue, multiple, onSelected, value],
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					asChild
					variant="outline"
					className={cn(
						"hover:border-ring focus:border:ring w-full hover:text-primary dark:hover:text-secondary",
						className,
					)}
				>
					<div
						tabIndex={0}
						role="combobox"
						aria-expanded={open}
						className={cn(
							"w-full justify-between font-normal hover:bg-inherit flex items-center",
							className,
						)}
					>
						<span className="truncate">{selectedEntry}</span>

						<div className="ml-1 flex items-center gap-1">
							{clearable && hasSelection && (
								<button
									type="button"
									onClick={(e) => clearSelection(e)}
									className="hover:text-destructive rounded p-0.5 transition-colors"
									aria-label={t("common.clear")}
								>
									<X className="h-3 w-3" />
								</button>
							)}
							<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
						</div>
					</div>
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-full p-0">
				<Command aria-multiselectable={multiple}>
					<CommandInput
						placeholder={t("common.search")}
						disabled={searchInputDisabled}
						onValueChange={(q) => onSearch?.(q)}
					/>
					<CommandEmpty>{t("common.no_results")}</CommandEmpty>
					<CommandList>
						<CommandGroup>
							{entries.map((entry) => (
								<CommandItem
									key={entry.id}
									value={entry.id}
									onSelect={() => toggleSelection(entry.id)}
									className="hover:bg-accent flex items-center gap-2"
								>
									<div className="flex w-full items-center gap-2">
										<div
											className={cn(
												"flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border",
												isSelected(entry.id)
													? "bg-primary border-primary"
													: "border-input",
											)}
										>
											{isSelected(entry.id) && (
												<Check className="text-primary-foreground h-3 w-3" />
											)}
										</div>
										<span className="truncate">{entry.label}</span>
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
