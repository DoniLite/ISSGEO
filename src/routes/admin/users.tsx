import UsersPage from '@/components/dashboard/pages/Users';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/users')({
  component: UsersPage,
});
