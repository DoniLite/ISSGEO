import CalendarPage from '@/components/dashboard/pages/Calendar';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/calendar')({
  component: CalendarPage,
});
