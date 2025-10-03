import TrainingCalendar from '@/components/courses/CalendarPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/calendar')({
  component: TrainingCalendar,
});
