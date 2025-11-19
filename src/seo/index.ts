/**
 * SEO helpers: build meta objects to use with any head manager.
 * Example usage with `react-helmet-async`:
 *
 * const helmetContext = {};
 * <HelmetProvider context={helmetContext}>
 *   <Helmet>
 *     {buildMeta({ title: '...', description: '...', url: '...', image: '...' })}
 *   </Helmet>
 * </HelmetProvider>
 */

export type MetaProps = {
	title: string;
	description?: string;
	url?: string;
	image?: string;
	author?: string;
};

export function buildMeta({
	title,
	description,
	url,
	image,
	author,
}: MetaProps) {
	const meta: Record<string, string> = {
		"og:title": title,
		"og:description": description || "",
		"og:type": "website",
		"twitter:card": image ? "summary_large_image" : "summary",
	};

	if (url) meta["og:url"] = url;
	if (image) meta["og:image"] = image;
	if (author) meta["author"] = author;

	return meta;
}

/**
 * Build a URL to the OG image endpoint. Supply `baseUrl` (e.g. `https://example.com`).
 */
export function ogImageUrl(title: string, description?: string, baseUrl?: string) {
	const base = baseUrl ? String(baseUrl).replace(/\/$/, "") : "";
	const encodedTitle = encodeURIComponent(title || "ISSGEO");
	const encodedDesc = description ? `&description=${encodeURIComponent(description)}` : "";
	return base ? `${base}/api/og?title=${encodedTitle}${encodedDesc}` : `/api/og?title=${encodedTitle}${encodedDesc}`;
}

export default buildMeta;
