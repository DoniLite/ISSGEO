import { useTranslation } from 'react-i18next';

interface ServiceHeroProps {
  titleKey: string;
  descriptionKey: string;
}

export default function Hero({ titleKey, descriptionKey }: ServiceHeroProps) {
  const { t } = useTranslation();

  return (
    <div className='absolute inset-0 top-[20%] lg:top-0 flex items-center justify-center p-4'>
      <div className='flex gap-4 flex-col items-center text-center'>
        <h1 className='text-white text-3xl lg:text-5xl font-extrabold max-w-2xl'>
          {t(titleKey)}
        </h1>

        <p className='mt-4 font-medium text-white/90 text-sm max-w-xl mx-auto'>
          {t(descriptionKey)}
        </p>
      </div>
    </div>
  );
}
