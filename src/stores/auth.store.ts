import { useStoreAsyncOperations } from "@/lib/table/hooks/store/useStoreAsyncOperations";
import type { BaseStore } from "./base.store";
import { useState } from "react";
import type { UserTableType } from "@/db";
import { apiClient } from "@/hooks/fetch-api";
import { useNavigate } from "@tanstack/react-router";
import type { LoginDTO } from "@/api/user";

interface AuthStore extends BaseStore {
	user?: Pick<UserTableType, "id" | "name" | "email" | "image">;
	me: () => Promise<void>;
	login: (dto: LoginDTO) => Promise<void>;
	logout: () => Promise<void>;
}

export function useAuthStore(): AuthStore {
	const { loading, error, withAsyncOperation, resetState } =
		useStoreAsyncOperations();
	const navigate = useNavigate();
	const [user, setUser] =
		useState<Pick<UserTableType, "id" | "name" | "email" | "image">>();

	const me = withAsyncOperation(async () => {
		const { data, status } = await apiClient.call("users", "/users/me", "GET");

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
	});

	const login = withAsyncOperation(async (dto: LoginDTO) => {
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
	});

	const logout = withAsyncOperation(async () => {
		await apiClient.call("users", "/users/logout", "GET");
		navigate({
			to: "/admin/login",
		});
	});

	return {
		loading,
		error,
		reset: resetState,
		user,
		me,
		login,
		logout,
	};
}
