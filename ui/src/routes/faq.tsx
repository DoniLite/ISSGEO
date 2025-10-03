import FaqPage from '@/components/faq/Page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/faq')({
  component: FaqPage,
});
