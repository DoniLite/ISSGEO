import { Badge } from '../ui/badge';
import cover from '../../../assets/coverv2.jpg';
import cover2 from '../../../assets/coverv1.jpg';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export default function Missions() {
  const { t } = useTranslation();
  return (
    <div
      id='missions'
      className='w-full bg-linear-to-br from-secondary/60 via-secondary/80 to-secondary py-12 text-secondary-foreground my-8 lg:my-[8rem]'
    >
      <div className='container mx-auto p-2 lg:p-4'>
        <Badge className='my-4'>{t('navBadge.missions')}</Badge>
        <div className='w-full flex gap-3 lg:gap-8 flex-col lg:flex-row'>
          <img
            src={cover}
            alt='cover'
            className='w-full h-[16rem] lg:w-[40%] lg:h-[25rem] rounded-md shadow object-cover'
          />
          <div className='w-full lg:w-[58%] flex flex-col'>
            <span className='text-sm text-muted-foreground'>
              Mission Subtitle
            </span>
            <h2 className='text-lg lg:text-2xl font-bold text-primary'>
              Mission Title
            </h2>
            <p className='mt-2 lg:mt-8'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et
              consequuntur eveniet dignissimos porro deleniti voluptate,
              quisquam, ex suscipit, provident repudiandae hic. Optio similique
              aspernatur, aliquam cumque magni hic earum in itaque, illum
              doloremque laboriosam modi eveniet fugiat. Repellendus, nemo eius
              qui blanditiis numquam, voluptatum praesentium natus deserunt
            </p>
            <Link
              to='/'
              className='mt-4 text-sm bg-primary py-3 px-4 hover:bg-primary/90 font-bold w-full lg:w-[60%] rounded-[4px] flex justify-center text-primary-foreground'
            >
              Read more
            </Link>
          </div>
        </div>

        <div className='w-full flex gap-3 lg:gap-8 flex-col-reverse lg:flex-row mt-[8rem]'>
          <div className='w-full lg:w-[58%] flex flex-col'>
            <span className='text-sm text-muted-foreground'>
              Mission Subtitle
            </span>
            <h2 className='text-lg lg:text-2xl font-bold text-primary'>
              Mission Title
            </h2>
            <p className='mt-2 lg:mt-8'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et
              consequuntur eveniet dignissimos porro deleniti voluptate,
              quisquam, ex suscipit, provident repudiandae hic. Optio similique
              aspernatur, aliquam cumque magni hic earum in itaque, illum
              doloremque laboriosam modi eveniet fugiat. Repellendus, nemo eius
              qui blanditiis numquam, voluptatum praesentium natus deserunt
            </p>
            <Link
              to='/'
              className='mt-4 text-sm bg-primary py-3 px-4 hover:bg-primary/90 font-bold w-full lg:w-[60%] rounded-[4px] flex justify-center text-primary-foreground'
            >
              Read more
            </Link>
          </div>
          <img
            src={cover2}
            alt='cover'
            className='w-full h-[16rem] lg:w-[40%] lg:h-[25rem] rounded-md shadow object-cover'
          />
        </div>
      </div>
    </div>
  );
}
