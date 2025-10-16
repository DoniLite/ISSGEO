import ContactPage from '@/components/dashboard/pages/Contact';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/calendar')({
  component: ContactPage,
});
