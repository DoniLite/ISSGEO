import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AvatarInput from "../../shared/entity/AvatarInput";
import { toast } from "sonner";
import Layout from "../Layout";

export default function ProfilePage() {
	const { t } = useTranslation();
	const { user, updateProfile, updatePassword, me } = useAuthStore();

	const [profileForm, setProfileForm] = useState<{
		name: string;
		email: string;
		image?: string | null;
	}>({
		name: "",
		email: "",
		image: null,
	});

	const [passwordForm, setPasswordForm] = useState({
		previousPassword: "",
		newPassword: "",
	});

	useEffect(() => {
		if (user) {
			setProfileForm({
				name: user.name || "",
				email: user.email || "",
				image: user.image,
			});
		} else {
			me();
		}
	}, [user, me]);

	const handleProfileUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user?.id) return;
		try {
			await updateProfile(user.id, {
				...profileForm,
				image: profileForm.image || undefined,
			});
			toast.success(t("admin.profile.toast.updateProfile.success"));
		} catch {
			toast.error(t("common.toast.error.default.title"));
		}
	};

	const handlePasswordUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user?.id) return;
		try {
			await updatePassword({
				id: user.id,
				previousPassword: passwordForm.previousPassword,
				newPassword: passwordForm.newPassword,
			});
			setPasswordForm({ previousPassword: "", newPassword: "" });
			toast.success(t("admin.profile.toast.updatePassword.success"));
		} catch {
			toast.error(t("common.toast.error.default.title"));
		}
	};

	return (
		<Layout>
			<div className="flex flex-col gap-8 p-4 md:p-8 max-w-4xl mx-auto">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold">{t("common.profile")}</h1>
					<p className="text-muted-foreground">
						{t("admin.profile.description")}
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-2">
					{/* Profile Information */}
					<div className="border rounded-lg p-6 shadow-sm bg-card">
						<h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
							{t("admin.profile.generalInformation")}
						</h2>
						<form
							onSubmit={handleProfileUpdate}
							className="flex flex-col gap-4"
						>
							<div className="flex justify-center mb-6">
								<AvatarInput
									value={profileForm.image}
									onChange={(base64) =>
										setProfileForm((prev) => ({ ...prev, image: base64 }))
									}
									name={user?.name}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label htmlFor="name" className="text-sm font-medium">
									{t("admin.profile.form.name")}
								</label>
								<input
									id="name"
									type="text"
									value={profileForm.name}
									onChange={(e) =>
										setProfileForm((prev) => ({
											...prev,
											name: e.target.value,
										}))
									}
									className="ring-muted focus:ring-primary rounded-md bg-transparent px-4 py-2 ring outline-none w-full"
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label htmlFor="email" className="text-sm font-medium">
									{t("admin.profile.form.email")}
								</label>
								<input
									id="email"
									type="email"
									value={profileForm.email}
									onChange={(e) =>
										setProfileForm((prev) => ({
											...prev,
											email: e.target.value,
										}))
									}
									className="ring-muted focus:ring-primary rounded-md bg-transparent px-4 py-2 ring outline-none w-full"
								/>
							</div>

							<Button type="submit" className="mt-4 w-full">
								{t("common.update")}
							</Button>
						</form>
					</div>

					{/* Password Update */}
					<div className="border rounded-lg p-6 shadow-sm bg-card h-fit">
						<h2 className="text-xl font-semibold mb-6">
							{t("admin.profile.security")}
						</h2>
						<form
							onSubmit={handlePasswordUpdate}
							className="flex flex-col gap-4"
						>
							<div className="flex flex-col gap-2">
								<label
									htmlFor="previousPassword"
									className="text-sm font-medium"
								>
									{t("admin.profile.previousPassword")}
								</label>
								<input
									id="previousPassword"
									type="password"
									required
									value={passwordForm.previousPassword}
									onChange={(e) =>
										setPasswordForm((prev) => ({
											...prev,
											previousPassword: e.target.value,
										}))
									}
									className="ring-muted focus:ring-primary rounded-md bg-transparent px-4 py-2 ring outline-none w-full"
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label htmlFor="newPassword" className="text-sm font-medium">
									{t("admin.profile.newPassword")}
								</label>
								<input
									id="newPassword"
									type="password"
									required
									value={passwordForm.newPassword}
									onChange={(e) =>
										setPasswordForm((prev) => ({
											...prev,
											newPassword: e.target.value,
										}))
									}
									className="ring-muted focus:ring-primary rounded-md bg-transparent px-4 py-2 ring outline-none w-full"
								/>
							</div>

							<Button
								type="submit"
								className="mt-4 w-full"
								variant="destructive"
							>
								{t("admin.profile.updatePassword")}
							</Button>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	);
}
