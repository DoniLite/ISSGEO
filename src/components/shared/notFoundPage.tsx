import { useNavigate, type NotFoundRouteProps } from "@tanstack/react-router";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { AlertCircle } from "lucide-react";
import { Alert } from "../ui/alert";
import { Button } from "../ui/button";

export default function NotFound({ data }: NotFoundRouteProps) {
	const navigate = useNavigate();
	return (
		<div className="w-full h-screen bg-background text-foreground flex justify-center items-center">
			<Card>
				<CardHeader>
					<h1>Page not found...</h1>
				</CardHeader>

				<CardContent>
					<Alert
						variant={"destructive"}
						className="flex gap-3 justify-between items-center"
					>
						<AlertCircle />
						<p>
							You're probably wanting to navigate to an non existent route or
							resource
						</p>
						{import.meta.env?.NODE_ENV === "development" && (
							<span> data: {JSON.stringify(data)}</span>
						)}
					</Alert>
				</CardContent>
				<CardFooter>
					<Button
						variant={"link"}
						className="dark:text-secondary cursor-pointer"
						onClick={() => navigate({ to: "/" })}
					>
						Go back home
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
