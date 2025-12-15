import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AvatarInputProps {
	value?: string | null;
	onChange?: (base64: string | null) => void;
	name?: string | null;
	disabled?: boolean;
	fallbackText?: string;
	altText?: string;
}

/**
 * Avatar component that works as a form input
 * Returns base64 encoded image string
 */
export default function AvatarInput({
	value,
	onChange,
	name,
	disabled = false,
	fallbackText,
	altText,
}: AvatarInputProps) {
	const { t } = useTranslation();
	const [imageHasError, setImageHasError] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const computedFallbackText = useMemo(() => {
		return getInitials(name || fallbackText || t("common.fallbackText"));
	}, [name, fallbackText, t]);

	const isImageDataValid = useMemo(() => {
		if (!value) {
			return false;
		}
		if (typeof value === "string") {
			return value.startsWith("http") || value.startsWith("data:image");
		}
		return true;
	}, [value]);

	const handleImageError = () => setImageHasError(true);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			console.error("Invalid file type. Please select an image.");
			return;
		}

		// Convert to base64
		const reader = new FileReader();
		reader.onloadend = () => {
			const base64String = reader.result as string;
			setImageHasError(false);
			onChange?.(base64String);
		};
		reader.onerror = () => {
			console.error("Error reading file");
		};
		reader.readAsDataURL(file);
	};

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const handleRemove = () => {
		onChange?.(null);
		setImageHasError(false);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="flex items-center gap-4">
			<Avatar className="size-20">
				{value && isImageDataValid && !imageHasError ? (
					<AvatarImage
						src={value}
						alt={altText || `${name || "Entity"} Logo/Avatar`}
						onError={handleImageError}
					/>
				) : (
					<div
						className="bg-muted flex size-full items-center justify-center rounded-full"
						data-slot="avatar-fallback"
					>
						{computedFallbackText}
					</div>
				)}
			</Avatar>

			<div className="flex flex-col gap-2">
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					disabled={disabled}
					className="hidden"
				/>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={handleButtonClick}
					disabled={disabled}
					className="w-fit"
				>
					<Upload className="size-4 mr-2" />
					{value ? t("common.change_image") : t("common.upload_image")}
				</Button>
				{value && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleRemove}
						disabled={disabled}
						className="w-fit text-destructive hover:text-destructive"
					>
						{t("common.remove_image")}
					</Button>
				)}
			</div>
		</div>
	);
}
