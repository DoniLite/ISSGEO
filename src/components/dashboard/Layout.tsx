import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { TablePaginationProvider } from "../../lib/table/helpers/TablePaginationProvider";
import LanguageSwitcher from "../shared/LanguageSwitcher";
import { ThemeToggle } from "../shared/ThemeToogle";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<TablePaginationProvider>
				<AppSidebar />
				<main className="p-2 lg:p-8 container mx-auto">
					<div className="w-full flex justify-between items-center">
						<SidebarTrigger />
						<div className="flex gap-3 items-center bg-primary/60 px-8 py-1 rounded-lg">
							<LanguageSwitcher />
							<ThemeToggle />
						</div>
					</div>
					{children}
				</main>
			</TablePaginationProvider>
		</SidebarProvider>
	);
}
