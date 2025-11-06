/** biome-ignore-all lint/correctness/useUniqueElementIds: <> */
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { useTranslation } from "react-i18next";
import { useState, type MouseEvent } from "react";
import type { CreateTestimonialDTO } from "@/api/testimonials";
import { toast } from "sonner";

interface ReviewModalProps {
	open: boolean;
	setOpen: (state: boolean) => void;
	create: (data: CreateTestimonialDTO) => Promise<void>;
}

export default function ReviewModal({
	open,
	setOpen,
	create,
}: ReviewModalProps) {
	const [testimonial, setTestimonial] = useState<CreateTestimonialDTO>({
		name: "",
		message: "",
		starNumber: 3,
	});
	const { t } = useTranslation();

	async function handleCreateTestimonial(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			await create(testimonial);
			toast.success(
				`${t("testimonials.toast.success.title")}\n${t("testimonials.toast.success.message")}`,
			);
		} catch (e) {
			console.error(e);
			toast.error(
				`${t("testimonials.toast.error.title")}\n${t("testimonials.toast.error.message")}`,
			);
		}
		setOpen(false);
	}

	const appreciationOptions = [
		{
			field: "Very Bad",
			starNumber: 1,
		},
		{
			field: "Bad",
			starNumber: 2,
		},
		{
			field: "Medium",
			starNumber: 3,
		},
		{
			field: "Good",
			starNumber: 4,
		},
		{
			field: "Very Good",
			starNumber: 5,
		},
	];

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (open !== o) {
					setOpen(o);
				}
			}}
		>
			<form>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{t("testimonials.form.title")}</DialogTitle>
						<DialogDescription>
							{t("testimonials.form.description")}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4">
						<div className="grid gap-3">
							<Label htmlFor="name-1">{t("testimonials.form.name")}</Label>
							<Input
								id="name"
								name="name"
								value={testimonial.name}
								onChange={(e) => {
									e.preventDefault();
									const v = e.currentTarget.value;
									setTestimonial((t) => ({
										...t,
										name: v,
									}));
								}}
							/>
						</div>
						<div className="grid gap-3">
							<Label>{t("testimonials.form.appreciation.label")}</Label>
							<Select
								onValueChange={(v) =>
									setTestimonial((prev) => ({
										...prev,
										starNumber:
											appreciationOptions.find((a) => a.field === v)
												?.starNumber ?? prev.starNumber,
									}))
								}
								value={t(
									`testimonials.form.appreciation.fields.${appreciationOptions.findIndex(
										(a) => a.starNumber === testimonial.starNumber,
									)}`,
								)}
							>
								<SelectTrigger className="w-full px-3 py-2">
									<span className="line-clamp-1">
										{t(
											`testimonials.form.appreciation.fields.${appreciationOptions.findIndex(
												(a) => a.starNumber === testimonial.starNumber,
											)}`,
										)}
									</span>
								</SelectTrigger>
								<SelectContent>
									{appreciationOptions.map((a, i) => (
										<SelectItem key={a.field} value={a.field}>
											{t(`testimonials.form.appreciation.fields.${i}`)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="username-1">
								{t("testimonials.form.description")}
							</Label>
							<textarea
								id="message"
								name="message"
								value={testimonial.message}
								onChange={(e) => {
									e.preventDefault();
									const v = e.currentTarget.value;
									setTestimonial((t) => ({
										...t,
										message: v,
									}));
								}}
								className="dark:bg-input/30 bg-transparent lg:p-4 p-3 rounded-lg border border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
							></textarea>
						</div>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">{t("testimonials.form.cancel")}</Button>
						</DialogClose>
						<Button type="submit" onClick={handleCreateTestimonial}>
							{t("testimonials.form.send")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
}
