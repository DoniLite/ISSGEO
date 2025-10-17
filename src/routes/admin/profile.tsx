import IndexPage from '@/components/dashboard/pages/Index';
// import { apiClient } from '@/hooks/api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/profile')({
  component: IndexPage,
});
