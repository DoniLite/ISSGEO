import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';
import Autoplay, { type AutoplayOptionsType } from 'embla-carousel-autoplay';

export interface SliderProps {
  items: ReactNode[];
  className?: HTMLAttributes<HTMLDivElement>['className'];
  pluginOptions?: AutoplayOptionsType;
  iconsVariants?: {
    next?: React.ComponentProps<typeof CarouselNext>['variant'];
    prev?: React.ComponentProps<typeof CarouselPrevious>['variant'];
  };
  showNavigation?: boolean;
}

export function Slider({ items, className, pluginOptions = {}, iconsVariants, showNavigation = true }: SliderProps) {
  return (
    <Carousel className='w-full' plugins={[Autoplay(pluginOptions)]}>
      <CarouselContent>
        {items.map((item, idx) => (
          <CarouselItem
            key={String(idx)}
            className={cn('md:basis-1/2 lg:basis-1/3', className)}
          >
            {item}
          </CarouselItem>
        ))}
      </CarouselContent>
      {showNavigation && (
        <>
          <CarouselPrevious variant={iconsVariants?.prev} />
          <CarouselNext variant={iconsVariants?.next} />
        </>
      )}
    </Carousel>
  );
}
