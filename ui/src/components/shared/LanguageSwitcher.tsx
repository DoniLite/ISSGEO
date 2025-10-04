import i18n from "i18n";
import { Languages } from "lucide-react";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function LanguageSwitcher() {
	const [currentLang, setCurrentLang] = useState(i18n.language.toUpperCase());
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex gap-2 p-3 items-center text-primary-foreground cursor-pointer">
					{currentLang}
					<Languages className="w-6 h-6" />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{/** biome-ignore lint/style/noNonNullAssertion: Object never empty */}
				{Object.keys(i18n.options.resources!).map((lang) => (
					<DropdownMenuItem
						key={lang}
						className="flex items-center justify-center"
						onClick={() => {
							i18n.changeLanguage(lang);
							setCurrentLang(lang.toUpperCase());
						}}
					>
						{lang.toUpperCase()}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
