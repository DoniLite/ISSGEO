/** biome-ignore-all lint/correctness/useUniqueElementIds: <> */
import { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DynamicIcon, iconNames } from 'lucide-react/dynamic';
import { Plus, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Stepper, { Step } from '@/components/Stepper';
import { Label } from '@/components/ui/label';
import EntitySelect from '@/components/shared/entity/SortedCombobox';
import { Select, SelectContent, SelectTrigger } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import useCoursesStore from '@/stores/formations/courses.store';
import useThematicStoreStore from '@/stores/formations/thematic.store';
import useKeyCompetencyStore from '@/stores/formations/keyCompetency.store';
import type { KeyCompetencyTableType, TrainingTableType } from '@/db';
import type { CreateCourseDTO } from '@/api/formations/DTO/courses.dto';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { EditionMode } from '@/lib/table/hooks/forms/useEntityEditor';
import type { PaginationQuery } from '@/lib/interfaces/pagination';

// Schema de validation
const trainingSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères'),
  duration: z.number().min(1, 'La durée doit être supérieure à 0'),
  priceMin: z.number().min(0, 'Le prix minimum doit être positif'),
  priceMax: z.number().min(0, 'Le prix maximum doit être positif'),
  participants: z.number().optional(),
  thematicId: z.string().optional(),
  targetAudience: z.string().optional(),
  learningOutcomes: z.array(z.string()).optional(),
  modules: z.array(z.string()).optional(),
});

const competencySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  icon: z.string(),
  sectors: z.array(z.string()),
  advantages: z.array(z.string()),
});

type TrainingFormData = z.infer<typeof trainingSchema>;
type CompetencyFormData = z.infer<typeof competencySchema>;

const iconList = iconNames;

function IconSelector({
  value,
  onChange,
}: {
  value: (typeof iconNames)[number];
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const filteredIcons = useMemo(() => {
    return iconList
      .filter((icon) => icon.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 50);
  }, [search]);

  const IconComponent = value ? (
    <DynamicIcon
      name={value}
      className='w-4 h-4 text-primary dark:text-secondary'
    />
  ) : null;

  return (
    <Select
      open={showPicker}
      onOpenChange={(v) => {
        if (v !== showPicker) {
          setShowPicker(v);
        }
      }}
    >
      <SelectTrigger>
        <div className='flex gap-2 items-center'>
          {IconComponent ? (
            <span className='flex items-center gap-2 font-bold'>
              {IconComponent}
              {value}
            </span>
          ) : (
            t('admin.formations.form.icons.selection_label')
          )}
        </div>
      </SelectTrigger>

      <SelectContent>
        <Card className='mt-2 p-4 max-h-96 overflow-auto w-[90%] lg:w-auto'>
          <div className='mb-4'>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder={t(
                  'admin.formations.form.icons.search_icons_label'
                )}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-8'
              />
            </div>
          </div>
          <div className='grid grid-cols-6 gap-2'>
            {filteredIcons.map((iconName) => {
              const Icon = <DynamicIcon name={iconName} className='w-5 h-5' />;
              return (
                <button
                  key={iconName}
                  type='button'
                  onClick={() => {
                    onChange(iconName);
                    setShowPicker(false);
                  }}
                  className={`p-3 rounded hover:bg-accent flex items-center justify-center ${
                    value === iconName
                      ? 'bg-primary text-primary-foreground'
                      : ''
                  }`}
                  title={iconName}
                >
                  {Icon}
                </button>
              );
            })}
          </div>
        </Card>
      </SelectContent>
    </Select>
  );
}

function ArrayInput({
  value = [],
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}) {
  const [inputValue, setInputValue] = useState('');

  const addItem = () => {
    if (inputValue.trim()) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <Button type='button' onClick={addItem} size='icon'>
          <Plus className='w-4 h-4' />
        </Button>
      </div>
      <div className='space-y-1'>
        {value.map((item, index) => (
          <div
            key={item}
            className='flex items-center gap-2 p-2 bg-muted rounded'
          >
            <span className='flex-1 text-sm'>{item}</span>
            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              onClick={() => removeItem(index)}
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrainingCreationForm() {
  const courseStore = useCoursesStore();
  const thematicStore = useThematicStoreStore();
  const keyCompetencyStore = useKeyCompetencyStore();
  const navigate = useNavigate();
  const { courseId } = useSearch({
    strict: true,
    from: '/admin/courses/form',
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    thematicStore.fetchData();
    if (courseId) {
      courseStore.findOne(courseId).then((d) => {
        if (d) {
          reset({
            title: d.title,
            description: d.description,
            duration: d.duration,
            priceMax: d.priceMax,
            priceMin: d.priceMin,
            participants: d.participants as number,
            thematicId: d.thematicId as string,
            targetAudience: d.targetAudience as string,
            learningOutcomes: d.learningOutcomes as string[],
            modules: d.modules as string[],
          });
          setModule(d);
          setEditionState(EditionMode.UPDATE);
        }
      });
      keyCompetencyStore.fetchData({ moduleId: courseId } as PaginationQuery);
    }
  }, []);

  const { t } = useTranslation();
  const [currentCompetency, setCurrentCompetency] =
    useState<CompetencyFormData | null>(null);
  const [showNewThematic, setShowNewThematic] = useState(false);
  const [newThematicName, setNewThematicName] = useState('');
  const [newThematicIcon, setNewThematicIcon] = useState('');
  const [newModule, setModule] = useState<TrainingTableType>();
  const [selectedCompetency, setSelectedCompetency] = useState<
    KeyCompetencyTableType[]
  >([]);
  const [editionState, setEditionState] = useState<EditionMode>(
    EditionMode.CREATE
  );
  const printedCompetency = useMemo(
    () => keyCompetencyStore.items,
    [keyCompetencyStore.items]
  );
  const thematicEntries = useMemo(
    () =>
      thematicStore.items.map((e) => ({
        label: e.name,
        id: e.id as string,
      })),
    [thematicStore.items]
  );

  const {
    register,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      participants: 0,
      learningOutcomes: [],
      modules: [],
    },
  });

  const addThematic = async () => {
    if (newThematicName && newThematicIcon) {
      await thematicStore.create({
        name: newThematicName,
        icon: newThematicIcon,
      });
      setNewThematicName('');
      setNewThematicIcon('');
      setShowNewThematic(false);
    }
  };

  const addCompetency = async (competency: CompetencyFormData) => {
    if (newModule?.id) {
      const res = await keyCompetencyStore.create({
        ...competency,
        moduleId: newModule?.id,
      });
      if (res) {
        setSelectedCompetency((prev) => [res, ...prev]);
      }
      setCurrentCompetency(null);
    }
  };

  return (
    <div className='min-h-screen bg-background p-2 lg:p-4'>
      <div className='container mx-auto'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Stepper
            initialStep={1}
            onFinalStepCompleted={() => {
              console.log('final step');
              navigate({
                to: '/admin/courses',
              });
            }}
            onStepChange={(stepNumber) => {
              const formData = watch();
              if (stepNumber === 4) {
                if (editionState === EditionMode.CREATE) {
                  console.log('form data ===>', formData);
                  courseStore
                    .create(formData as CreateCourseDTO)
                    .then((course) => setModule(course));
                } else if (newModule?.id) {
                  console.log('form data ===>', formData);
                  courseStore.update(newModule?.id, formData);
                }
              }
            }}
            stepCircleContainerClassName='bg-card'
          >
            {/* Base information */}
            <Step>
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>
                  {t('admin.formations.form.step1.title')}
                </h3>

                <div className='space-y-2'>
                  <Label htmlFor='title'>
                    {t('admin.formations.form.step1.title_label')}
                    <span className='text-red-500 ml-1'>*</span>
                  </Label>
                  <Input
                    id='title'
                    {...register('title')}
                    placeholder={t(
                      'admin.formations.form.step1.title_placeholder'
                    )}
                  />
                  {errors.title && (
                    <p className='text-sm text-destructive'>
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='description'>
                    {t('admin.formations.form.step1.description_label')}
                    <span className='text-red-500 ml-1'>*</span>
                  </Label>
                  <textarea
                    id='description'
                    {...register('description')}
                    className='w-full min-h-[100px] px-3 py-2 border rounded-md'
                    placeholder={t(
                      'admin.formations.form.step1.description_placeholder'
                    )}
                  />
                  {errors.description && (
                    <p className='text-sm text-destructive'>
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className='grid gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='duration'>
                      {t('admin.formations.form.step1.duration_label')}
                      <span className='text-red-500 ml-1'>*</span>
                    </Label>
                    <Input
                      id='duration'
                      type='number'
                      {...register('duration', { valueAsNumber: true })}
                      placeholder={t(
                        'admin.formations.form.step1.duration_placeholder'
                      )}
                    />
                    {errors.duration && (
                      <p className='text-sm text-destructive'>
                        {errors.duration.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Step>

            {/* Step 2: Price and thematic */}
            <Step>
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>
                  {t('admin.formations.form.step2.title')}
                </h3>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='priceMin'>
                      {t('admin.formations.form.step2.min_price_label')}
                      <span className='text-red-500 ml-1'>*</span>
                    </Label>
                    <Input
                      id='priceMin'
                      type='number'
                      {...register('priceMin', { valueAsNumber: true })}
                      placeholder={t(
                        'admin.formations.form.step2.min_price_placeholder'
                      )}
                    />
                    {errors.priceMin && (
                      <p className='text-sm text-destructive'>
                        {errors.priceMin.message}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='priceMax'>
                      {t('admin.formations.form.step2.max_price_label')}
                      <span className='text-red-500 ml-1'>*</span>
                    </Label>
                    <Input
                      id='priceMax'
                      type='number'
                      {...register('priceMax', { valueAsNumber: true })}
                      placeholder={t(
                        'admin.formations.form.step2.max_price_placeholder'
                      )}
                    />
                    {errors.priceMax && (
                      <p className='text-sm text-destructive'>
                        {errors.priceMax.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label>
                    {t('admin.formations.form.step2.thematic_label')}
                    <span className='text-red-500 ml-1'>*</span>
                  </Label>
                  <Controller
                    name='thematicId'
                    control={control}
                    render={({ field }) => (
                      <EntitySelect
                        entries={thematicEntries}
                        placeholder={t(
                          'admin.formations.form.step2.thematic_placeholder'
                        )}
                        value={field.value}
                        onSelected={field.onChange}
                        onSearch={(query) =>
                          thematicStore.fetchData({ search: query })
                        }
                        clearable
                      />
                    )}
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setShowNewThematic(!showNewThematic)}
                  >
                    <Plus className='w-4 h-4 mr-2' />
                    {t('admin.formations.form.step2.new_thematic')}
                  </Button>
                </div>

                {showNewThematic && (
                  <Card className='p-4 space-y-4'>
                    <div className='space-y-2'>
                      <Label>
                        {t(
                          'admin.formations.form.step2.create_thematic.title_label'
                        )}
                      </Label>
                      <Input
                        value={newThematicName}
                        onChange={(e) => setNewThematicName(e.target.value)}
                        placeholder={t(
                          'admin.formations.form.step2.create_thematic.title_placeholder'
                        )}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>
                        {t(
                          'admin.formations.form.step2.create_thematic.icon_label'
                        )}
                      </Label>
                      <IconSelector
                        value={newThematicIcon as (typeof iconNames)[number]}
                        onChange={setNewThematicIcon}
                      />
                    </div>
                    <Button
                      type='button'
                      onClick={addThematic}
                      className='w-full'
                    >
                      {t('admin.formations.form.step2.create_thematic.submit')}
                    </Button>
                  </Card>
                )}
              </div>
            </Step>

            {/* Step 3: Target public and modules */}
            <Step>
              <div className='space-y-4 overflow-y-scroll h-[25rem]'>
                <h3 className='text-lg font-semibold'>
                  {t('admin.formations.form.step3.title')}
                </h3>

                <div className='space-y-2'>
                  <Label htmlFor='targetAudience'>
                    {t('admin.formations.form.step3.target_label')}
                  </Label>
                  <Input
                    id='targetAudience'
                    {...register('targetAudience')}
                    placeholder={t(
                      'admin.formations.form.step3.target_placeholder'
                    )}
                  />
                </div>

                <div className='space-y-2'>
                  <Label>
                    {t('admin.formations.form.step3.objectives_label')}
                  </Label>
                  <Controller
                    name='learningOutcomes'
                    control={control}
                    render={({ field }) => (
                      <ArrayInput
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder={t(
                          'admin.formations.form.step3.objectives_placeholder'
                        )}
                      />
                    )}
                  />
                </div>

                <div className='space-y-2'>
                  <Label>
                    {t('admin.formations.form.step3.modules_label')}
                  </Label>
                  <Controller
                    name='modules'
                    control={control}
                    render={({ field }) => (
                      <ArrayInput
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder={t(
                          'admin.formations.form.step3.modules_placeholder'
                        )}
                      />
                    )}
                  />
                </div>
              </div>
            </Step>

            {/* Step 4: Key competency */}
            <Step>
              <div className='space-y-4 overflow-y-scroll h-[30rem]'>
                <h3 className='text-lg font-semibold'>
                  {t('admin.formations.form.step4.title')}
                </h3>

                <div className='space-y-4'>
                  {printedCompetency.map((comp, index) => (
                    <Card key={comp.title} className='p-4'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start gap-3'>
                          {comp.icon && (
                            <DynamicIcon
                              name={comp.icon as (typeof iconList)[number]}
                            />
                          )}
                          <div>
                            <h4 className='font-semibold'>{comp.title}</h4>
                            <p className='text-sm text-muted-foreground'>
                              {comp.description}
                            </p>
                            {comp.sectors && comp?.sectors?.length > 0 && (
                              <div className='flex gap-1 mt-2 flex-wrap'>
                                {comp.sectors.map((sector) => (
                                  <span
                                    key={sector}
                                    className='px-2 py-1 bg-accent text-xs rounded'
                                  >
                                    {sector}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon-sm'
                          onClick={() =>
                            setSelectedCompetency(
                              selectedCompetency.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {!currentCompetency ? (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() =>
                      setCurrentCompetency({
                        title: '',
                        description: '',
                        icon: '',
                        sectors: [],
                        advantages: [],
                      })
                    }
                    className='w-full'
                  >
                    <Plus className='w-4 h-4 mr-2' />
                    {t('admin.formations.form.step4.add_competency')}
                  </Button>
                ) : (
                  <Card className='p-4 space-y-4'>
                    <div className='space-y-2'>
                      <Label>
                        {t(
                          'admin.formations.form.step4.competency_title_label'
                        )}
                      </Label>
                      <Input
                        value={currentCompetency.title}
                        onChange={(e) =>
                          setCurrentCompetency({
                            ...currentCompetency,
                            title: e.target.value,
                          })
                        }
                        placeholder={t(
                          'admin.formations.form.step4.competency_title_placeholder'
                        )}
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label>
                        {t(
                          'admin.formations.form.step4.competency_description_label'
                        )}
                      </Label>
                      <textarea
                        value={currentCompetency.description}
                        onChange={(e) =>
                          setCurrentCompetency({
                            ...currentCompetency,
                            description: e.target.value,
                          })
                        }
                        className='w-full min-h-[80px] px-3 py-2 border rounded-md'
                        placeholder={t(
                          'admin.formations.form.step4.competency_description_placeholder'
                        )}
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label>
                        {t('admin.formations.form.step4.competency_icon_label')}
                      </Label>
                      <IconSelector
                        value={
                          currentCompetency.icon as (typeof iconList)[number]
                        }
                        onChange={(icon) =>
                          setCurrentCompetency({ ...currentCompetency, icon })
                        }
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label>
                        {t(
                          'admin.formations.form.step4.competency_sectors_label'
                        )}
                      </Label>
                      <ArrayInput
                        value={currentCompetency.sectors}
                        onChange={(sectors) =>
                          setCurrentCompetency({
                            ...currentCompetency,
                            sectors,
                          })
                        }
                        placeholder={t(
                          'admin.formations.form.step4.competency_sectors_placeholder'
                        )}
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label>
                        {t(
                          'admin.formations.form.step4.competency_advantages_label'
                        )}
                      </Label>
                      <ArrayInput
                        value={currentCompetency.advantages}
                        onChange={(advantages) =>
                          setCurrentCompetency({
                            ...currentCompetency,
                            advantages,
                          })
                        }
                        placeholder={t(
                          'admin.formations.form.step4.competency_advantages_placeholder'
                        )}
                      />
                    </div>

                    <div className='flex gap-2'>
                      <Button
                        type='button'
                        onClick={() => {
                          if (
                            currentCompetency.title &&
                            currentCompetency.description
                          ) {
                            console.log('called');
                            addCompetency(currentCompetency);
                          }
                        }}
                        className='flex-1'
                      >
                        {t('admin.formations.form.step4.add_button')}
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => setCurrentCompetency(null)}
                      >
                        {t('admin.formations.form.step4.cancel_button')}
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </Step>
          </Stepper>
        </form>
      </div>
    </div>
  );
}
