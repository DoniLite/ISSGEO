import CompetencesPage from '@/components/courses/CompetencePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/competences')({
  component: CompetencesPage,
});
