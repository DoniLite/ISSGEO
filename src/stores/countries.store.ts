/** biome-ignore-all lint/suspicious/noExplicitAny: Receiving response from a rest API */
import { create } from "zustand";
import { applyStoreMiddleware } from "./base.store";

interface Country {
	code: string; // e.g. "BF"
	name: string; // e.g. "Burkina Faso"
	flag: string; // e.g. "https://flagcdn.com/w320/bf.png"
	callingCode: string; // e.g. "+226"
}

interface CountryStore {
	countries: Country[];
	fetchCountries: () => Promise<void>;
	loading: boolean;
	error: string | null;
}

export const useCountriesStore = create<CountryStore>()(
	applyStoreMiddleware(
		(set, get) => ({
			countries: [],
			loading: false,
			error: null,
			fetchCountries: async () => {
				if (get().countries.length > 0) return; // Déjà en cache → pas de refetch

				set({ loading: true, error: null });

				try {
					const res = await fetch(
						"https://restcountries.com/v3.1/all?fields=cca2,idd,flags,name",
					);
					if (!res.ok) throw new Error("Failed to fetch countries");

					const data: any[] = await res.json();

					const parsed: Country[] = data
						.filter((c: any) => c.idd?.root) // On garde seulement ceux qui ont un indicatif
						.map((c: any) => ({
							code: c.cca2,
							name: c.name.common,
							flag: c.flags.png,
							callingCode: `${c.idd.root}${c.idd.suffixes?.[0] ?? ""}`, // +226
						}))
						.sort((a, b) => a.name.localeCompare(b.name)); // Tri alphabétique

					set({ countries: parsed, loading: false });
				} catch (err: any) {
					set({ error: err.message, loading: false });
				}
			},
		}),
		"countries-store",
	),
);
