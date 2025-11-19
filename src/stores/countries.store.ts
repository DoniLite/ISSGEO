/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import type { BaseStore } from "./base.store";
import { useStoreAsyncOperations } from "@/lib/table/hooks/store/useStoreAsyncOperations";
import { useState } from "react";

interface Country {
	code: string; // e.g. "BF"
	name: string; // e.g. "Burkina Faso"
	flag: string; // e.g. "https://flagcdn.com/w320/bf.png"
	callingCode: string; // e.g. "+226"
}

interface CountryStore extends BaseStore {
	countries: Country[];
	fetchCountries: () => Promise<void>;
}

export default function useCountriesStore(): CountryStore {
	const { loading, withAsyncOperation, error, resetState } =
		useStoreAsyncOperations();
	const [countries, setCountries] = useState<Country[]>([]);

	const fetchCountries = withAsyncOperation(async () => {
		if (countries.length > 0) {
			return;
		} // Cache déjà rempli

		const res = await fetch(
			"https://restcountries.com/v3.1/all?fields=cca2,idd,flags,name",
		);
		if (!res.ok) {
			throw new Error("Failed to fetch countries");
		}

		const data: any[] = await res.json();

		const parsed: Country[] = data
			.filter((c: any) => c.idd?.root)
			.map((c: any) => ({
				code: c.cca2,
				name: c.name.common,
				flag: c.flags.png,
				callingCode: `${c.idd.root}${c.idd.suffixes?.[0] ?? ""}`,
			}))
			.sort((a, b) => a.name.localeCompare(b.name));

		setCountries(parsed);
	});

	return {
		countries,
		loading,
		error,
		fetchCountries,
		reset: resetState,
	};
}
