import IndexPage from "@/components/dashboard/pages/Index";
// import { apiClient } from '@/hooks/api';
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
	component: IndexPage,
	// async beforeLoad(ctx) {
	//   const res = await apiClient.call('users', '/users/me', 'GET');
	//   console.log('auth res from admin ====>', res);
	//   if ('authenticated' in res && !res.authenticated) {
	//     throw redirect({
	//       to: '/admin/login',
	//     });
	//   }
	// },
});
