import { useStoreAsyncOperations } from "@/lib/table/hooks/store/useStoreAsyncOperations";
import type { BaseStore } from "./base.store";
import { useState, useMemo } from "react";
import type { UserTableType } from "@/db";
import { apiClient } from "@/lib/fetch-api";
import { useNavigate } from "@tanstack/react-router";
import type {
	LoginDTO,
	UpdateUserDto,
	UpdateUserPasswordDTO,
} from "@/api/user";

interface AuthStore extends BaseStore {
	user?: Pick<UserTableType, "id" | "name" | "email" | "image">;
	me: () => Promise<void>;
	login: (dto: LoginDTO) => Promise<void>;
	logout: () => Promise<void>;
	updateProfile: (id: string, data: UpdateUserDto) => Promise<void>;
	updatePassword: (data: UpdateUserPasswordDTO) => Promise<void>;
}

export function useAuthStore(): AuthStore {
	const { loading, error, withAsyncOperation, resetState } =
		useStoreAsyncOperations();
	const navigate = useNavigate();
	const [user, setUser] =
		useState<Pick<UserTableType, "id" | "name" | "email" | "image">>();

	const me = useMemo(
		() =>
			withAsyncOperation(async () => {
				const { data, status } = await apiClient.call(
					"users",
					"/users/me",
					"GET",
				);

				if (
					("authenticated" in data && !data.authenticated) ||
					(status >= 300 && status < 500)
				) {
					navigate({
						to: "/admin/login",
					});
					return;
				}
				setUser(data as Pick<UserTableType, "id" | "name" | "email" | "image">);
			}),
		[withAsyncOperation, navigate],
	);

	const login = useMemo(
		() =>
			withAsyncOperation(async (dto: LoginDTO) => {
				const { data, status } = await apiClient.call(
					"users",
					"/users/login",
					"POST",
					{
						body: dto,
					},
				);

				if (status === 200) {
					setUser(data);
					navigate({ to: "/admin" });
				}
			}),
		[withAsyncOperation, navigate],
	);

	const logout = useMemo(
		() =>
			withAsyncOperation(async () => {
				await apiClient.call("users", "/users/logout", "GET");
				navigate({
					to: "/admin/login",
				});
			}),
		[withAsyncOperation, navigate],
	);

	const updateProfile = useMemo(
		() =>
			withAsyncOperation(async (id: string, data: UpdateUserDto) => {
				const res = await apiClient.call("users", "/users/:id", "PATCH", {
					body: data,
					params: { id },
				});
				if (res.status >= 200 && res.status < 300) {
					setUser((prev) => (prev ? { ...prev, ...data } : undefined));
				}
			}),
		[withAsyncOperation],
	);

	const updatePassword = useMemo(
		() =>
			withAsyncOperation(async (data: UpdateUserPasswordDTO) => {
				await apiClient.call("users", "/users/password", "POST", {
					body: data,
				});
			}),
		[withAsyncOperation],
	);

	return {
		loading,
		error,
		reset: resetState,
		user,
		me,
		login,
		logout,
		updateProfile,
		updatePassword,
	};
}
