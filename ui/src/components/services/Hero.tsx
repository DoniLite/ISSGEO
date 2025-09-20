interface ServiceHeroProps {
  title?: string;
  description?: string;
}

export default function Hero({
  title = "Discover what services we're providing for you",
  description = `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sit labore
          cupiditate accusamus illo hic, architecto cum rem atque veniam iusto
          quis provident blanditiis! Nobis, ipsam corrupti dicta itaque natus
          minima eius corporis perferendis odio provident culpa eveniet
          perspiciatis laborum. Illo dolore reprehenderit alias debitis
          necessitatibus earum iste consequatur corporis perspiciatis!`,
}: ServiceHeroProps) {
  return (
    <div className='absolute inset-0 top-[20%] lg:top-0 flex items-center justify-center p-4'>
      <div className='flex gap-4 flex-col items-center'>
        <h1 className='text-white lg:text-4xl font-bold max-w-xl'>{title}</h1>

        <p className='mt-4 font-bold text-xs max-w-xl mx-auto'>{description}</p>
      </div>
    </div>
  );
}
