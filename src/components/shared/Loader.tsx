import { Loader2 } from "lucide-react";

export default function Loader() {
	return (
		<div className="container mx-auto h-screen flex justify-center items-center text-center">
			<div className="flex items-center gap-3">
				<Loader2 className="animate-spin text-primary dark:text-secondary w-8 h-8`" />
				<span className="text-lg font-bold">Loading...</span>
			</div>
		</div>
	);
}
