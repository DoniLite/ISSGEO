import ProfilePage from "@/components/dashboard/pages/ProfilePage";
// import { apiClient } from '@/hooks/api';
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/profile")({
	component: ProfilePage,
});
