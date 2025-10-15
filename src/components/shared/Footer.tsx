import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-background text-foreground border-t border-border mt-12">
			<div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Brand / Logo */}
				<div>
					<h2 className="text-lg font-semibold text-primary dark:text-secondary">
						ISSGEO Institute
					</h2>
					<p className="text-muted-foreground mt-2 text-sm">
						Building tech for the future. Research, innovation and great user
						experience.
					</p>
				</div>

				{/* Navigation Links */}
				<div className="flex flex-col gap-2">
					<h3 className="font-semibold text-foreground mb-2">Quick Links</h3>
					<a
						href="/about"
						className="text-muted-foreground hover:text-primary transition-colors"
					>
						About Us
					</a>
					<a
						href="/blog"
						className="text-muted-foreground hover:text-primary transition-colors"
					>
						Blog
					</a>
					<a
						href="/contact"
						className="text-muted-foreground hover:text-primary transition-colors"
					>
						Contact
					</a>
					<a
						href="/faq"
						className="text-muted-foreground hover:text-primary transition-colors"
					>
						FAQ
					</a>
				</div>

				{/* Social Links */}
				<div>
					<h3 className="font-semibold text-foreground mb-2">Follow Us</h3>
					<div className="flex gap-4">
						<a
							href="https://facebook.com"
							className="text-muted-foreground hover:text-primary transition-colors"
							aria-label="Facebook"
						>
							<Facebook size={20} />
						</a>
						<a
							href="https://twitter.com"
							className="text-muted-foreground hover:text-primary transition-colors"
							aria-label="Twitter"
						>
							<Twitter size={20} />
						</a>
						<a
							href="https://instagram.com"
							className="text-muted-foreground hover:text-primary transition-colors"
							aria-label="Instagram"
						>
							<Instagram size={20} />
						</a>
						<a
							href="https://linkedin.com"
							className="text-muted-foreground hover:text-primary transition-colors"
							aria-label="LinkedIn"
						>
							<Linkedin size={20} />
						</a>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-border mt-6">
				<p className="text-center text-xs text-muted-foreground py-4">
					© {new Date().getFullYear()} ISSGEO. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
