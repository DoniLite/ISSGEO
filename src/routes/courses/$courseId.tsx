import { createFileRoute } from '@tanstack/react-router';
import {
	AlertTriangle,
	BookOpen,
	CheckCircle,
	Clock,
	DollarSign,
	Target,
} from 'lucide-react';
import {
	useEffect,
	useMemo,
	useState,
	type Dispatch,
	type SetStateAction,
} from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '@/components/shared/Footer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BG_LINEAR_CLASS } from '@/lib/const';
import useCoursesStore from '@/stores/formations/courses.store';
import type { RollingTableType, TrainingTableType } from '@/db';
import useModuleStore from '@/stores/formations/module.store';
import z from 'zod';
import type { GenericFormField } from '@/components/shared/entity/GenericForm';
import type { CreateRollingDTO } from '@/api/rolling';
import type { PaginationQuery } from '@/lib/interfaces/pagination';
import { EditionMode } from '@/lib/table/hooks/forms/useEntityEditor';
import GenericForm from '@/components/shared/entity/GenericForm';
import Loader from '@/components/shared/Loader';
import { Badge } from '@/components/ui/badge';
import useRollingStore from '@/stores/rolling.store';
import { toast } from 'sonner';

export const Route = createFileRoute('/courses/$courseId')({
	component: TrainingDetail,
});

function TrainingDetail() {
	const { t } = useTranslation();
	const { courseId } = Route.useParams();
	const courseStore = useCoursesStore();
	const moduleStore = useModuleStore();

	const [training, setTraining] = useState<TrainingTableType>();
	const [selectedModules, setSelectedModules] = useState<string[]>([]);

	const courseDuration = useMemo(() => {
		let moduleDuration = 0;
		const targetModules = moduleStore.allItems.filter((mod) =>
			selectedModules.includes(mod.id as string),
		);
		for (const module of targetModules) {
			moduleDuration += module.duration;
		}
		return moduleDuration;
	}, [moduleStore.allItems, selectedModules]);

	const courseFees = useMemo(() => {
		let moduleFees = 0;
		const targetModules = moduleStore.allItems.filter((mod) =>
			selectedModules.includes(mod.id as string),
		);
		for (const module of targetModules) {
			moduleFees += module.price;
		}
		return moduleFees;
	}, [moduleStore.allItems, selectedModules]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		courseStore.findOne(courseId).then((d) => setTraining(d));
		moduleStore.fetchAll({ courseId }, { force: true });
	}, []);

	const modules = useMemo(() => moduleStore.allItems, [moduleStore.allItems]);

	if (courseStore.loading) {
		return <Loader />;
	}

	if (!training) {
		return (
			<div className="container mx-auto h-screen flex justify-center items-center text-center">
				<Alert variant="destructive">
					<AlertTriangle className="h-4 w-4" />
					<AlertTitle>Erreur</AlertTitle>
					<AlertDescription>
						{t('common.no_results', { id: courseId })}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<>
			<div className={`py-16 ${BG_LINEAR_CLASS}`}>
				<div className="container mx-auto p-4">
					<h1 className="text-4xl font-extrabold text-primary mb-2">
						{training.title}
					</h1>
					<p className="text-xl text-muted-foreground mb-6">
						{training.description}
					</p>

					<div className="grid w-full lg:grid-cols-2 gap-8">
						<main className="w-full">
							{/* Learning objectives */}
							<Card className="mb-8">
								<CardHeader className="flex flex-row items-center space-y-0">
									<CheckCircle className="w-5 h-5 mr-2" />
									<CardTitle className="text-xl">
										{t('pages.trainingDetail.outcomesTitle')}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 list-none p-0">
										{training.learningOutcomes?.map((key) => (
											<li key={key} className="flex items-start">
												<span className="mr-3">&bull;</span>
												{key}
											</li>
										))}
									</ul>
								</CardContent>
							</Card>

							{/* Course Modules */}
							<Card>
								<CardHeader className="flex flex-row items-center space-y-0">
									<BookOpen className="w-5 h-5 mr-2" />
									<CardTitle className="text-xl">
										{t('pages.trainingDetail.modulesTitle')}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className="list-decimal list-inside space-y-3 p-0">
										{modules.map((mod) => (
											<li key={mod.id} className="flex">
												<div className="flex flex-col">
													<h2 className="font-bold">{mod.title}</h2>
													<div className="flex items-center gap-3">
														<Badge variant={'destructive'}>
															{mod.duration} Hours
														</Badge>
														<Badge variant={'secondary'}>
															{mod.price} FCFA
														</Badge>
													</div>
												</div>
											</li>
										))}
									</ol>
								</CardContent>
							</Card>
						</main>

						{/* Registering form */}
						<aside className="w-full">
							<Card className="lg:sticky top-4">
								<CardHeader>
									<CardTitle className="text-center text-2xl">
										{t('pages.trainingDetail.details')}
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex justify-between items-center border-b pb-2">
										<span className="flex items-center text-sm font-medium">
											<Clock className="w-4 h-4 mr-2" />{' '}
											{t('pages.trainingDetail.duration')}
										</span>
										<span className="font-semibold">
											{courseDuration} {t('common.hours')}
										</span>
									</div>
									<div className="flex justify-between items-center border-b pb-2">
										<span className="flex items-center text-sm font-medium">
											<DollarSign className="w-4 h-4 mr-2" />
											{t('pages.trainingDetail.cost')}
										</span>
										<span className="font-semibold">{courseFees} FCFA</span>
									</div>
									<div className="flex justify-between items-center border-b pb-2">
										<span className="flex items-center text-sm font-medium">
											<Target className="w-4 h-4 mr-2" /> Public:
										</span>
										<span className="font-semibold text-right">
											{training.targetAudience}
										</span>
									</div>

									<h3 className="text-lg font-semibold pt-4">
										{t('pages.trainingDetail.enrollCta')}
									</h3>
									<RollingForm
										courseId={courseId}
										setSelectedModules={setSelectedModules}
									/>
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

interface RollingFormProps {
	courseId: string;
	setSelectedModules: Dispatch<SetStateAction<string[]>>;
}

function RollingForm({ courseId, setSelectedModules }: RollingFormProps) {
	const { t } = useTranslation();
	const moduleStore = useModuleStore();
	const rollingStore = useRollingStore();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		moduleStore.fetchData({ courseId } as PaginationQuery);
	}, []);

	const modules = useMemo(() => {
		return moduleStore.items.map((mod) => ({
			id: mod.id as string,
			label: mod.title,
		}));
	}, [moduleStore.items]);

	const rollingFormSchema = z.object({
		name: z
			.string()
			.min(2, { error: t('pages.trainingDetail.form.errors.name') }),
		contact: z
			.string()
			.min(2, { error: t('pages.trainingDetail.form.errors.contact') }),
		country: z.string().optional(),
		profession: z.string().optional(),
		schoolLevel: z.string().optional(),
		experience: z.string().optional(),
		modules: z
			.array(z.string())
			.min(1, { error: t('pages.trainingDetail.form.errors.modules') }),
	});

	const fields: GenericFormField<RollingTableType & { modules: string[] }>[] = [
		{
			name: 'modules',
			label: t('pages.trainingDetail.form.modules.title'),
			placeholder: t('pages.trainingDetail.form.modules.placeholder'),
			type: 'combobox',
			entries: modules,
			multiple: true,
		},
		{
			name: 'name',
			label: t('pages.trainingDetail.form.name.title'),
			placeholder: t('pages.trainingDetail.form.name.placeholder'),
			type: 'text',
			required: true,
		},
		{
			name: 'contact',
			label: t('pages.trainingDetail.form.contact.title'),
			placeholder: t('pages.trainingDetail.form.contact.placeholder'),
			type: 'text',
			required: true,
		},
		{
			name: 'country',
			label: t('pages.trainingDetail.form.country.title'),
			placeholder: t('pages.trainingDetail.form.country.placeholder'),
			type: 'text',
		},
		{
			name: 'profession',
			label: t('pages.trainingDetail.form.profession.title'),
			placeholder: t('pages.trainingDetail.form.profession.placeholder'),
			type: 'text',
		},
		{
			name: 'schoolLevel',
			label: t('pages.trainingDetail.form.schoolLevel.title'),
			placeholder: t('pages.trainingDetail.form.schoolLevel.placeholder'),
			type: 'text',
		},
		{
			name: 'experience',
			label: t('pages.trainingDetail.form.experience.title'),
			placeholder: t('pages.trainingDetail.form.experience.placeholder'),
			type: 'text',
		},
	];

	// biome-ignore lint/suspicious/noExplicitAny: <>
	const onSave = async (data: any) => {
		console.log(data);
		const rollingPayload: CreateRollingDTO = {
			name: data.name,
			contact: data.contact,
			country: data.country,
			profession: data.profession,
			schoolLevel: data.schoolLevel,
			experience: data.experience,
			courseId,
		};
		try {
			await rollingStore.create(rollingPayload, data.modules);
			toast.success(t('pages.trainingDetail.toast.success.title'), {
				description: t('pages.trainingDetail.toast.success.message'),
			});
		} catch (e) {
			console.error(e);
			toast.error(t('pages.trainingDetail.toast.error.title'), {
				description: t('pages.trainingDetail.toast.error.message'),
			});
		}
	};

	const onSearch = async (q: string) => {
		await moduleStore.fetchData({ courseId, search: q } as PaginationQuery);
	};

	const editionMode = EditionMode.CREATE;

	const entityModel: RollingTableType & { modules: string[] } = {
		name: '',
		contact: '',
		modules: [],
	};

	return (
		<GenericForm
			entity={entityModel}
			fields={fields}
			schema={rollingFormSchema}
			onSubmit={onSave}
			editionMode={editionMode}
			onSearch={onSearch}
			subscriber={(data) => {
				const values = data.values;
				setSelectedModules(values.modules);
			}}
		/>
	);
}
