import { socials } from "const/links.const";
import { Facebook } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
	const { t } = useTranslation();

	return (
		<footer className="bg-background text-foreground border-t border-border mt-12">
			<div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Brand / Logo */}
				<div>
					<h2 className="text-lg font-semibold text-primary dark:text-secondary">
						{t("footer.brand")}
					</h2>
					<p className="text-muted-foreground mt-2 text-sm">
						{t("footer.tagline")}
					</p>
				</div>

				{/* Navigation Links */}
				<div className="flex flex-col gap-2">
					<h3 className="font-semibold text-foreground mb-2">
						{t("footer.quickLinks")}
					</h3>
					<a
						href="/about"
						className="text-muted-foreground hover:text-primary transition-colors"
					>
						{t("footer.links.about")}
					</a>
					<a
						href="/#contact"
						className="text-muted-foreground hover:text-primary transition-colors"
					>
						{t("footer.links.contact")}
					</a>
					<a
						href="/faq"
						className="text-muted-foreground hover:text-primary transition-colors"
					>
						{t("footer.links.faq")}
					</a>
				</div>

				{/* Social Links */}
				<div>
					<h3 className="font-semibold text-foreground mb-2">
						{t("footer.followUs")}
					</h3>
					<div className="flex gap-4">
						<a
							href={socials.facebook}
							className="text-muted-foreground hover:text-primary transition-colors"
							aria-label={t("footer.social.facebook")}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Facebook size={20} />
						</a>
						{/* <a
							href="https://twitter.com"
							className="text-muted-foreground hover:text-primary transition-colors"
							aria-label={t("footer.social.twitter")}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Twitter size={20} />
						</a>
						<a
							href="https://instagram.com"
							className="text-muted-foreground hover:text-primary transition-colors"
							aria-label={t("footer.social.instagram")}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Instagram size={20} />
						</a>
						<a
							href="https://linkedin.com"
							className="text-muted-foreground hover:text-primary transition-colors"
							aria-label={t("footer.social.linkedin")}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Linkedin size={20} />
						</a> */}
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-border mt-6">
				<p className="text-center text-xs text-muted-foreground py-4">
					{t("footer.copyright", { year: new Date().getFullYear() })}
				</p>
			</div>
		</footer>
	);
}
