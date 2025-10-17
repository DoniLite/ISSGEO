import TrainingCreationForm from '@/components/dashboard/pages/FormationForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/courses/form')({
  component: TrainingCreationForm,
  validateSearch: (search: Record<string, unknown>) => {
    // validate and parse the search params into a typed state
    return {
      courseId: String(search.courseId) || undefined,
    };
  },
});
