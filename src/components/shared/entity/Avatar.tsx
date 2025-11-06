import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface EntityAvatarProps {
	image?: string | null;
	name?: string | null;
	isSelected?: boolean;
	fallbackText?: string;
	altText?: string;
}

export default function EntityAvatar({
	image,
	name,
	isSelected = false,
	fallbackText,
	altText,
}: EntityAvatarProps) {
	const { t } = useTranslation();
	const [imageHasError, setImageHasError] = useState(false);

	// ✅ Texte de fallback (initiales ou valeur par défaut traduite)
	const computedFallbackText = useMemo(() => {
		return getInitials(name || fallbackText || t("common.fallbackText"));
	}, [name, fallbackText, t]);

	// ✅ Vérifie la validité de l’image
	const isImageDataValid = useMemo(() => {
		if (!image) {
			return false;
		}
		if (typeof image === "string") {
			return image.startsWith("http") || image.startsWith("data:image");
		}
		return true;
	}, [image]);

	const handleImageError = () => setImageHasError(true);

	return (
		<Avatar className={isSelected ? "border-primary border-2" : ""}>
			{image && isImageDataValid && !imageHasError ? (
				<AvatarImage
					src={image}
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
	);
}
