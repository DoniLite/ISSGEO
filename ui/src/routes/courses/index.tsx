import FormationsCatalogue from '@/components/courses/CatalogPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/courses/')({
  component: FormationsCatalogue,
});
