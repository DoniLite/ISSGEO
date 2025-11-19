import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * returns the first two characters of a user's name
 * @param name string
 * @returns string
 */
export function getInitials(name: string, toUpperCase = true) {
	if (!name) {
		return "";
	} // Handle empty input

	const words = name.trim().split(/\s+/); // Split by spaces
	const initials =
		words.length > 1
			? (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "") // First character of first and second word
			: (words[0]?.[0] ?? "") +
				(words[0]?.[words[0]?.length ? words[0].length - 1 : 0] ?? ""); // First and last character if one word

	return toUpperCase ? initials.toUpperCase() : initials;
}
