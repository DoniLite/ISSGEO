import { createRootRoute, Outlet } from "@tanstack/react-router";
import NavBar from "@/components/shared/nav/Navbar";
import ScrollToTop from "@/components/shared/ScrollToTop";

export const Route = createRootRoute({
	component: () => (
		<>
			<NavBar />
			<Outlet />
			<ScrollToTop />
		</>
	),
});
