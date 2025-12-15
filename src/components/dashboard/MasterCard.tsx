import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

interface MasterCardProps {
	name: string;
	description: string;
	socials: {
		facebook?: string;
		twitter?: string;
		instagram?: string;
		linkedin?: string;
	};
	image: string;
}

export default function MasterCard({ image, name, description, socials }: MasterCardProps) {
	return (
		<div className="p-2 flex flex-col justify-center items-center">
			<img
				src={image}
				alt="Team"
				className="w-28 h-28 rounded-full shadow object-cover"
			/>
			<h2 className="text-lg font-bold">{name}</h2>
			<div className="w-full flex gap-2 justify-center">
				{socials.facebook && (
					<a
						href={socials.facebook}
						target="_blank"
						rel="noreferrer"
						className="p-2 rounded-full bg-primary-foreground flex justify-center items-center hover:bg-primary-foreground/80 transition-all"
					>
						<Facebook className="w-5 h-5 text-primary" />
					</a>
				)}
				{socials.twitter && (
					<a
						href={socials.twitter}
						target="_blank"
						rel="noreferrer"
						className="p-2 rounded-full bg-primary-foreground flex justify-center items-center hover:bg-primary-foreground/80 transition-all"
					>
						<Twitter className="w-5 h-5 text-primary" />
					</a>
				)}
				{socials.instagram && (
					<a
						href={socials.instagram}
						target="_blank"
						rel="noreferrer"
						className="p-2 rounded-full bg-primary-foreground flex justify-center items-center hover:bg-primary-foreground/80 transition-all"
					>
						<Instagram className="w-5 h-5 text-primary" />
					</a>
				)}
				{socials.linkedin && (
					<a
						href={socials.linkedin}
						target="_blank"
						rel="noreferrer"
						className="p-2 rounded-full bg-primary-foreground flex justify-center items-center hover:bg-primary-foreground/80 transition-all"
					>
						<Linkedin className="w-5 h-5 text-primary" />
					</a>
				)}
			</div>
			<span className="text-sm font-semibold text-muted-foreground">
				{description}
			</span>
		</div>
	);
}
