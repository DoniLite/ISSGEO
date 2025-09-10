import { cn } from '@/lib/utils';
import type { HtmlHTMLAttributes } from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: HtmlHTMLAttributes<HTMLDivElement>['className'];
  [x: string]: unknown;
}

export default function Container({
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full my-8 p-2 lg:p-4 lg:my-[8rem]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
