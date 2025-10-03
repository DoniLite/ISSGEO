import Footer from '@/components/shared/Footer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import  { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import  { Input } from '@/components/ui/input';
import { BG_LINEAR_CLASS } from '@/lib/const';
import { MOCK_TRAININGS } from '@/lib/mock';
import { createFileRoute } from '@tanstack/react-router';
import { AlertTriangle, CheckCircle, BookOpen, Clock, DollarSign, Target } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/courses/$courseId')({
  component: TrainingDetail,
});


function TrainingDetail() {
  const { t } = useTranslation();
  const { courseId: trainingId } = Route.useParams();

  const training = useMemo(
    () => MOCK_TRAININGS.find((t) => t.id === trainingId),
    [trainingId]
  );

  if (!training) {
    return (
      <div className='container mx-auto my-16 text-center'>
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            {t('training.notFound', { id: trainingId })}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className={`py-16 ${BG_LINEAR_CLASS}`}>
        <div className='container mx-auto p-4'>
          <h1 className='text-4xl font-extrabold text-primary mb-2'>
            {t(training.titleKey)}
          </h1>
          <p className='text-xl text-muted-foreground mb-6'>
            {t(training.descriptionKey)}
          </p>

          <div className='grid lg:grid-cols-[1fr_350px] gap-8'>
            {/* Colonne de Contenu Détaillé */}
            <main>
              {/* Description Longue */}
              <Card className='mb-8'>
                <CardHeader>
                  <CardTitle>Description Détaillée</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-700 leading-relaxed'>
                    {t(training.detailedDescriptionKey)}
                  </p>
                </CardContent>
              </Card>

              {/* Objectifs Pédagogiques */}
              <Card className='mb-8'>
                <CardHeader className='flex flex-row items-center space-y-0'>
                  <CheckCircle className='w-5 h-5 mr-2 text-green-500' />
                  <CardTitle className='text-xl'>
                    {t('pages.trainingDetail.outcomesTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-3 list-none p-0'>
                    {training.learningOutcomesKeys.map((key) => (
                      <li key={key} className='flex items-start'>
                        <span className='mr-3 text-green-500'>&bull;</span>
                        {t(key)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Contenu Détaillé (Modules) */}
              <Card>
                <CardHeader className='flex flex-row items-center space-y-0'>
                  <BookOpen className='w-5 h-5 mr-2 text-indigo-500' />
                  <CardTitle className='text-xl'>
                    {t('pages.trainingDetail.modulesTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className='list-decimal list-inside space-y-3 p-0'>
                    {training.detailedModulesKeys.map((key) => (
                      <li key={key} className='font-medium text-gray-700'>
                        {t(key)}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </main>

            {/* Colonne d'Inscription / Info Clés */}
            <aside>
              <Card className='sticky top-4'>
                <CardHeader>
                  <CardTitle className='text-center text-2xl'>
                    Informations Clés
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex justify-between items-center border-b pb-2'>
                    <span className='flex items-center text-sm font-medium'>
                      <Clock className='w-4 h-4 mr-2' /> Durée:
                    </span>
                    <span className='font-semibold'>
                      {training.duration} heures
                    </span>
                  </div>
                  <div className='flex justify-between items-center border-b pb-2'>
                    <span className='flex items-center text-sm font-medium'>
                      <DollarSign className='w-4 h-4 mr-2' /> Coût:
                    </span>
                    <span className='font-semibold'>
                      {training.priceMin} - {training.priceMax} €
                    </span>
                  </div>
                  <div className='flex justify-between items-center border-b pb-2'>
                    <span className='flex items-center text-sm font-medium'>
                      <Target className='w-4 h-4 mr-2' /> Public:
                    </span>
                    <span className='font-semibold text-right'>
                      {t(training.targetAudienceKey)}
                    </span>
                  </div>

                  <h3 className='text-lg font-semibold pt-4'>
                    {t('pages.trainingDetail.enrollCta')}
                  </h3>
                  {/* Placeholder pour un formulaire d'inscription simplifié ou un lien */}
                  <form className='space-y-3'>
                    <Input placeholder='Nom Complet' required />
                    <Input
                      type='email'
                      placeholder='Email Professionnel'
                      required
                    />
                    <Button type='submit' className='w-full'>
                      S'inscrire / Demander un Devis
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
