/** biome-ignore-all lint/correctness/useUniqueElementIds: <> */
import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DynamicIcon, iconNames } from "lucide-react/dynamic";
import { Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Stepper, { Step } from "@/components/Stepper";
import { Label } from "@/components/ui/label";
import EntitySelect from "@/components/shared/entity/SortedCombobox";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import useCoursesStore from "@/stores/formations/courses.store";
import useThematicStoreStore from "@/stores/formations/thematic.store";
import useKeyCompetencyStore from "@/stores/formations/keyCompetency.store";
import useModuleStore from "@/stores/formations/module.store";
import type { TrainingTableType, ModuleTableType } from "@/db";
import type {
	CreateModuleTDO,
	UpdateModuleDTO,
} from "@/api/formations/DTO/modules.dto";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { EditionMode } from "@/lib/table/hooks/forms/useEntityEditor";
import { toast } from "sonner";
import Layout from "../Layout";

// Schema de validation
const trainingSchema = z.object({
	title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
	description: z
		.string()
		.min(10, "La description doit contenir au moins 10 caractères"),
	targetAudience: z.string(),
	thematicId: z.string(),
	learningOutcomes: z.array(z.string()),
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
	const [search, setSearch] = useState("");
	const [showPicker, setShowPicker] = useState(false);

	const filteredIcons = useMemo(() => {
		return iconList
			.filter((icon) => icon.toLowerCase().includes(search.toLowerCase()))
			.slice(0, 50);
	}, [search]);

	const IconComponent = value ? (
		<DynamicIcon
			name={value}
			className="w-4 h-4 text-primary dark:text-secondary"
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
				<div className="flex gap-2 items-center">
					{IconComponent ? (
						<span className="flex items-center gap-2 font-bold">
							{IconComponent}
							{value}
						</span>
					) : (
						t("admin.formations.form.icons.selection_label")
					)}
				</div>
			</SelectTrigger>

			<SelectContent>
				<Card className="mt-2 p-4 max-h-96 overflow-auto w-[90%] lg:w-auto">
					<div className="mb-4">
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder={t(
									"admin.formations.form.icons.search_icons_label",
								)}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-8"
							/>
						</div>
					</div>
					<div className="grid grid-cols-6 gap-2">
						{filteredIcons.map((iconName) => {
							const Icon = <DynamicIcon name={iconName} className="w-5 h-5" />;
							return (
								<button
									key={iconName}
									type="button"
									onClick={() => {
										onChange(iconName);
										setShowPicker(false);
									}}
									className={`p-3 rounded hover:bg-accent flex items-center justify-center ${
										value === iconName
											? "bg-primary text-primary-foreground"
											: ""
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
	const [inputValue, setInputValue] = useState("");

	const addItem = () => {
		if (inputValue.trim()) {
			onChange([...value, inputValue.trim()]);
			setInputValue("");
		}
	};

	const removeItem = (index: number) => {
		onChange(value.filter((_, i) => i !== index));
	};

	return (
		<div className="space-y-2">
			<div className="flex gap-2">
				<Input
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder={placeholder}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							addItem();
						}
					}}
				/>
				<Button type="button" onClick={addItem} size="icon">
					<Plus className="w-4 h-4" />
				</Button>
			</div>
			<div className="space-y-1">
				{value.map((item, index) => (
					<div
						key={item}
						className="flex items-center gap-2 p-2 bg-muted rounded"
					>
						<span className="flex-1 text-sm">{item}</span>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={() => removeItem(index)}
						>
							<Trash2 className="w-4 h-4" />
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
		from: "/admin/courses/form",
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		thematicStore.fetchData();
		if (typeof courseId === "string" && courseId !== "undefined") {
			courseStore.findOne(courseId).then((d) => {
				if (d) {
					reset({
						title: d.title,
						description: d.description,
						targetAudience: d.targetAudience as string,
						learningOutcomes: d.learningOutcomes as string[],
						thematicId: d.thematicId as string,
					});
					setModule(d);
					setEditionState(EditionMode.UPDATE);
				}
			});
			keyCompetencyStore.fetchAll({ moduleId: courseId }, { force: true });
			// fetch modules for this course and keep locally
			moduleStore.fetchAll({ courseId }, { force: true });
		}
	}, []);

	const { t } = useTranslation();
	const [currentCompetency, setCurrentCompetency] =
		useState<CompetencyFormData | null>(null);
	const [showNewThematic, setShowNewThematic] = useState(false);
	const [newThematicName, setNewThematicName] = useState("");
	const [newThematicIcon, setNewThematicIcon] = useState("");
	const [newModule, setModule] = useState<TrainingTableType>();
	const moduleStore = useModuleStore();
	const [currentModuleForm, setCurrentModuleForm] = useState<{
		title: string;
		price: number;
		duration: number;
		id?: string;
	} | null>(null);

	const [editionState, setEditionState] = useState<EditionMode>(
		EditionMode.CREATE,
	);

	const printedModules = useMemo(
		() => moduleStore.allItems,
		[moduleStore.allItems],
	);
	const printedCompetency = useMemo(
		() => keyCompetencyStore.allItems,
		[keyCompetencyStore.allItems],
	);

	const thematicEntries = useMemo(
		() =>
			thematicStore.items.map((e) => ({
				label: e.name,
				id: e.id as string,
			})),
		[thematicStore.items],
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
			learningOutcomes: [],
		},
	});

	const addThematic = async () => {
		if (newThematicName && newThematicIcon) {
			await thematicStore.create({
				name: newThematicName,
				icon: newThematicIcon,
			});
			setNewThematicName("");
			setNewThematicIcon("");
			setShowNewThematic(false);
		}
	};

	const updateCourseMeta = async () => {
		let totalDuration: number = 0;
		let priceMax: number = 0;

		for (const module of printedModules) {
			totalDuration += module.duration;
			priceMax += module.price;
		}

		const priceMin =
			printedModules.sort((a, b) => a.price - b.price)[0]?.price ?? 0;

		if (newModule?.id) {
			await courseStore.update(newModule.id, {
				totalDuration,
				priceMax,
				priceMin,
			});
		}
	};

	const addCompetency = async (competency: CompetencyFormData) => {
		if (newModule?.id) {
			await keyCompetencyStore.create({
				...competency,
				moduleId: newModule?.id,
			});
			setCurrentCompetency(null);
		}
	};

	/** Modules management for Step 5 */
	const startEditModule = (m: ModuleTableType) => {
		setCurrentModuleForm({
			title: m.title,
			price: m.price,
			duration: m.duration,
			id: m.id,
		});
	};

	const cancelEditModule = () => setCurrentModuleForm(null);

	const saveModule = async () => {
		if (!newModule?.id || !currentModuleForm) return;
		// prepare payloads with proper DTO types
		const createPayload: CreateModuleTDO = {
			title: currentModuleForm.title,
			price: currentModuleForm.price,
			duration: currentModuleForm.duration,
			courseId: newModule.id,
		};

		const updatePayload: UpdateModuleDTO = {
			title: currentModuleForm.title,
			price: currentModuleForm.price,
			duration: currentModuleForm.duration,
		};

		// If id present -> update
		if (currentModuleForm.id) {
			await moduleStore.update(currentModuleForm.id, updatePayload);
		} else {
			// create
			await moduleStore.create(createPayload);
		}

		setCurrentModuleForm(null);
	};

	const removeModuleLocal = async (id?: string) => {
		if (!id) return;
		await moduleStore.deleteOne(id);
	};

	const removeCompetency = async (id?: string) => {
		if (!id) return;

		await keyCompetencyStore.deleteOne(id);
	};

	return (
		<Layout>
			<form
				onSubmit={(e) => {
					e.preventDefault();
				}}
			>
				<Stepper
					initialStep={1}
					onFinalStepCompleted={() => {
						console.log("final step");
						updateCourseMeta()
							.then(() =>
								navigate({
									to: "/admin/courses",
								}),
							)
							.catch((e) => {
								console.error(e);
								toast.error(t("common.toast.error.unexpected.title"), {
									description: t("common.toast.error.unexpected.description"),
								});
							});
					}}
					onStepChange={(stepNumber) => {
						const formData = watch();
						if (stepNumber === 4) {
							if (editionState === EditionMode.CREATE) {
								courseStore
									.create(formData)
									.then((course) => setModule(course));
							} else if (newModule?.id) {
								courseStore.update(newModule?.id, formData);
							}
						}
					}}
					stepCircleContainerClassName="bg-card"
				>
					{/* Base information */}
					<Step>
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">
								{t("admin.formations.form.step1.title")}
							</h3>

							<div className="space-y-2">
								<Label htmlFor="title">
									{t("admin.formations.form.step1.title_label")}
									<span className="text-red-500 ml-1">*</span>
								</Label>
								<Input
									id="title"
									{...register("title")}
									placeholder={t(
										"admin.formations.form.step1.title_placeholder",
									)}
								/>
								{errors.title && (
									<p className="text-sm text-destructive">
										{errors.title.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">
									{t("admin.formations.form.step1.description_label")}
									<span className="text-red-500 ml-1">*</span>
								</Label>
								<textarea
									id="description"
									{...register("description")}
									className="w-full min-h-[100px] px-3 py-2 border rounded-md"
									placeholder={t(
										"admin.formations.form.step1.description_placeholder",
									)}
								/>
								{errors.description && (
									<p className="text-sm text-destructive">
										{errors.description.message}
									</p>
								)}
							</div>
						</div>
					</Step>

					{/* Step 2: Thematic */}
					<Step>
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">
								{t("admin.formations.form.step2.title")}
							</h3>

							<div className="space-y-2">
								<Label>
									{t("admin.formations.form.step2.thematic_label")}
									<span className="text-red-500 ml-1">*</span>
								</Label>
								<Controller
									name="thematicId"
									control={control}
									render={({ field }) => (
										<EntitySelect
											entries={thematicEntries}
											placeholder={t(
												"admin.formations.form.step2.thematic_placeholder",
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
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setShowNewThematic(!showNewThematic)}
								>
									<Plus className="w-4 h-4 mr-2" />
									{t("admin.formations.form.step2.new_thematic")}
								</Button>
							</div>

							{showNewThematic && (
								<Card className="p-4 space-y-4">
									<div className="space-y-2">
										<Label>
											{t(
												"admin.formations.form.step2.create_thematic.title_label",
											)}
										</Label>
										<Input
											value={newThematicName}
											onChange={(e) => setNewThematicName(e.target.value)}
											placeholder={t(
												"admin.formations.form.step2.create_thematic.title_placeholder",
											)}
										/>
									</div>
									<div className="space-y-2">
										<Label>
											{t(
												"admin.formations.form.step2.create_thematic.icon_label",
											)}
										</Label>
										<IconSelector
											value={newThematicIcon as (typeof iconNames)[number]}
											onChange={setNewThematicIcon}
										/>
									</div>
									<Button
										type="button"
										onClick={addThematic}
										className="w-full"
									>
										{t("admin.formations.form.step2.create_thematic.submit")}
									</Button>
								</Card>
							)}
						</div>
					</Step>

					{/* Step 3: Target public and modules */}
					<Step>
						<div className="space-y-4 overflow-y-scroll h-[25rem]">
							<h3 className="text-lg font-semibold">
								{t("admin.formations.form.step3.title")}
							</h3>

							<div className="space-y-2">
								<Label htmlFor="targetAudience">
									{t("admin.formations.form.step3.target_label")}
								</Label>
								<Input
									id="targetAudience"
									{...register("targetAudience")}
									placeholder={t(
										"admin.formations.form.step3.target_placeholder",
									)}
								/>
							</div>

							<div className="space-y-2">
								<Label>
									{t("admin.formations.form.step3.objectives_label")}
								</Label>
								<Controller
									name="learningOutcomes"
									control={control}
									render={({ field }) => (
										<ArrayInput
											value={field.value || []}
											onChange={field.onChange}
											placeholder={t(
												"admin.formations.form.step3.objectives_placeholder",
											)}
										/>
									)}
								/>
							</div>
						</div>
					</Step>

					{/* Step 4: Key competency */}
					<Step>
						<div className="space-y-4 overflow-y-scroll h-[30rem]">
							<h3 className="text-lg font-semibold">
								{t("admin.formations.form.step4.title")}
							</h3>

							<div className="space-y-4">
								{printedCompetency.map((comp) => (
									<Card key={comp.title} className="p-4">
										<div className="flex items-start justify-between">
											<div className="flex items-start gap-3">
												{comp.icon && (
													<DynamicIcon
														name={comp.icon as (typeof iconList)[number]}
													/>
												)}
												<div>
													<h4 className="font-semibold">{comp.title}</h4>
													<p className="text-sm text-muted-foreground">
														{comp.description}
													</p>
													{comp.sectors && comp?.sectors?.length > 0 && (
														<div className="flex gap-1 mt-2 flex-wrap">
															{comp.sectors.map((sector) => (
																<span
																	key={sector}
																	className="px-2 py-1 bg-accent text-xs rounded"
																>
																	{sector}
																</span>
															))}
														</div>
													)}
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon-sm"
												onClick={() => removeCompetency(comp.id)}
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</Card>
								))}
							</div>

							{!currentCompetency ? (
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										setCurrentCompetency({
											title: "",
											description: "",
											icon: "",
											sectors: [],
											advantages: [],
										})
									}
									className="w-full"
								>
									<Plus className="w-4 h-4 mr-2" />
									{t("admin.formations.form.step4.add_competency")}
								</Button>
							) : (
								<Card className="p-4 space-y-4">
									<div className="space-y-2">
										<Label>
											{t("admin.formations.form.step4.competency_title_label")}
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
												"admin.formations.form.step4.competency_title_placeholder",
											)}
										/>
									</div>

									<div className="space-y-2">
										<Label>
											{t(
												"admin.formations.form.step4.competency_description_label",
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
											className="w-full min-h-[80px] px-3 py-2 border rounded-md"
											placeholder={t(
												"admin.formations.form.step4.competency_description_placeholder",
											)}
										/>
									</div>

									<div className="space-y-2">
										<Label>
											{t("admin.formations.form.step4.competency_icon_label")}
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

									<div className="space-y-2">
										<Label>
											{t(
												"admin.formations.form.step4.competency_sectors_label",
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
												"admin.formations.form.step4.competency_sectors_placeholder",
											)}
										/>
									</div>

									<div className="space-y-2">
										<Label>
											{t(
												"admin.formations.form.step4.competency_advantages_label",
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
												"admin.formations.form.step4.competency_advantages_placeholder",
											)}
										/>
									</div>

									<div className="flex gap-2">
										<Button
											type="button"
											onClick={() => {
												if (
													currentCompetency.title &&
													currentCompetency.description
												) {
													addCompetency(currentCompetency);
												}
											}}
											className="flex-1"
										>
											{t("admin.formations.form.step4.add_button")}
										</Button>
										<Button
											type="button"
											variant="outline"
											onClick={() => setCurrentCompetency(null)}
										>
											{t("admin.formations.form.step4.cancel_button")}
										</Button>
									</div>
								</Card>
							)}
						</div>
					</Step>

					{/* Step 5 Modules */}
					<Step>
						<div className="space-y-4 overflow-y-scroll h-[30rem]">
							<h3 className="text-lg font-semibold">
								{t("admin.formations.form.step5.title")}
							</h3>

							<div className="space-y-4">
								{printedModules.map((mod) => (
									<Card key={mod.id} className="p-4">
										<div className="flex items-start justify-between">
											<div>
												<h4 className="font-semibold">{mod.title}</h4>
												<p className="text-sm text-muted-foreground">
													{t("admin.formations.form.step5.module_meta", {
														duration: mod.duration,
														price: mod.price,
													})}
												</p>
											</div>
											<div className="flex gap-2">
												<Button
													type="button"
													variant="ghost"
													size="icon-sm"
													onClick={() => startEditModule(mod)}
												>
													{t("admin.formations.form.step5.edit")}
												</Button>
												<Button
													type="button"
													variant="ghost"
													size="icon-sm"
													onClick={() => removeModuleLocal(mod.id)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</div>
									</Card>
								))}
							</div>

							{!currentModuleForm ? (
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										setCurrentModuleForm({ title: "", price: 0, duration: 0 })
									}
									className="w-full"
								>
									<Plus className="w-4 h-4 mr-2" />
									{t("admin.formations.form.step5.add_module")}
								</Button>
							) : (
								<Card className="p-4 space-y-4">
									<div className="space-y-2">
										<Label>
											{t("admin.formations.form.step5.module_title_label")}
										</Label>
										<Input
											value={currentModuleForm.title}
											onChange={(e) =>
												setCurrentModuleForm({
													...currentModuleForm,
													title: e.target.value,
												})
											}
										/>
									</div>

									<div className="space-y-2">
										<Label>
											{t("admin.formations.form.step5.module_price_label")}
										</Label>
										<Input
											value={String(currentModuleForm.price)}
											onChange={(e) =>
												setCurrentModuleForm({
													...currentModuleForm,
													price: Number(e.target.value),
												})
											}
										/>
									</div>

									<div className="space-y-2">
										<Label>
											{t("admin.formations.form.step5.module_duration_label")}
										</Label>
										<Input
											value={String(currentModuleForm.duration)}
											onChange={(e) =>
												setCurrentModuleForm({
													...currentModuleForm,
													duration: Number(e.target.value),
												})
											}
										/>
									</div>

									<div className="flex gap-2">
										<Button
											type="button"
											onClick={saveModule}
											className="flex-1"
										>
											{t("admin.formations.form.step5.save_button")}
										</Button>
										<Button
											type="button"
											variant="outline"
											onClick={cancelEditModule}
										>
											{t("admin.formations.form.step5.cancel_button")}
										</Button>
									</div>
								</Card>
							)}
						</div>
					</Step>
				</Stepper>
			</form>
		</Layout>
	);
}
