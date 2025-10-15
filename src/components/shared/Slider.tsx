import AutoScroll, {
  type AutoScrollOptionsType,
} from 'embla-carousel-auto-scroll';
import Autoplay, { type AutoplayOptionsType } from 'embla-carousel-autoplay';
import type { HTMLAttributes, ReactNode } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface BaseProps {
  items: ReactNode[];
  className?: HTMLAttributes<HTMLDivElement>['className'];
  iconsVariants?: {
    next?: React.ComponentProps<typeof CarouselNext>['variant'];
    prev?: React.ComponentProps<typeof CarouselPrevious>['variant'];
  };
  showNavigation?: boolean;
}

export interface SliderProps extends BaseProps {
  pluginOptions?: AutoplayOptionsType;
}

export function Slider({
  items,
  className,
  pluginOptions = {},
  iconsVariants,
  showNavigation = true,
}: SliderProps) {
  const plugins = useMemo(() => [Autoplay(pluginOptions)], [pluginOptions]);

  return (
    <Carousel className='w-full' plugins={plugins}>
      <CarouselContent>
        {items.map((item, idx) => (
          <CarouselItem
            key={String(idx)}
            className={cn('md:basis-1/3', className)}
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

export interface AnimatedSliderProps extends BaseProps {
  pluginOptions?: AutoScrollOptionsType;
}

export function AnimatedSlider({
  items,
  className,
  pluginOptions = {},
  iconsVariants,
  showNavigation = true,
}: AnimatedSliderProps) {
  const plugins = useMemo(() => [AutoScroll(pluginOptions)], [pluginOptions]);

  return (
    <Carousel className='w-full' plugins={plugins}>
      <CarouselContent>
        {items.map((item, idx) => (
          <CarouselItem
            key={String(idx)}
            className={cn('md:basis-1/3', className)}
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
