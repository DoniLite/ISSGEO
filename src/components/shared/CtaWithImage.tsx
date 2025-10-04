import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

interface CTAWithImagePropos extends PropsWithChildren {
	image: string;
	title: string;
	description?: string;
	subtitle?: string;
	reverse?: boolean;
}

export default function CTAWithImage({
	children,
	image,
	title,
	description,
	subtitle,
	reverse = false,
}: CTAWithImagePropos) {
	const { t } = useTranslation();
	return (
		<div
			className={`w-full flex gap-3 lg:gap-8 min-h-[16rem] lg:h-[25rem] ${reverse ? "lg:flex-row-reverse flex-col-reverse" : "lg:flex-row flex-col"}`}
		>
			<img
				src={image}
				alt="cover"
				className="w-full h-[16rem] lg:h-full lg:w-[40%] rounded-md shadow object-cover"
			/>
			<div className="w-full lg:w-[58%] h-full flex flex-col justify-center items-center">
				<div className="w-full flex flex-col">
					{subtitle && (
						<span className="text-sm text-muted-foreground">{t(subtitle)}</span>
					)}
					<h2 className="text-lg lg:text-2xl font-bold text-primary dark:text-secondary">
						{t(title)}
					</h2>
					{description && <p className="mt-2 lg:mt-8">{t(description)}</p>}
					{children}
				</div>
			</div>
		</div>
	);
}
