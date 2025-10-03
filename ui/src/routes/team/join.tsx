import JoinUsPage from '@/components/careers/JoinUs';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/team/join')({
  component: JoinUsPage,
});
