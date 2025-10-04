import type { StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

/**
 * Applies middleware to a Zustand store.
 * ```ts
 * export const createBaseStore = create<BaseStore>()(
 *   applyStoreMiddleware(
 *     (set) => ({
 *       reset: () => set(() => ({})),
 *     }),
 *     "base-store"
 *   )
 * );
 * ```
 * @param f Function to create the store
 * @param storeName Name of the store
 * @returns
 */
export const applyStoreMiddleware = <T>(
	f: StateCreator<T>,
	storeName: string,
) => devtools(persist(f, { name: storeName }));

export type BaseStore = {
	reset: () => void;
};
