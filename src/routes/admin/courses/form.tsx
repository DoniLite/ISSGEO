import TrainingCreationForm from '@/components/dashboard/pages/FormationForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/courses/form')({
  component: TrainingCreationForm,
});
