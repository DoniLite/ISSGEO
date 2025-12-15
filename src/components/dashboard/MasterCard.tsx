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

export default function MasterCard({ image, name, description }: MasterCardProps) {
	return (
		<div className="p-2 flex flex-col justify-center items-center">
			<img
				src={image}
				alt="Team"
				className="w-28 h-28 rounded-full shadow object-cover"
			/>
			<h2 className="text-lg font-bold">{name}</h2>
			<span className="text-sm font-semibold text-muted-foreground">
				{description}
			</span>
		</div>
	);
}
