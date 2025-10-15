import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";


export const Route = createFileRoute("/error")({
    component: Page
});


function Page() {
    const navigate = useNavigate()
    return (
    <div className='w-full h-screen bg-background text-foreground flex justify-center items-center'>
      <Card>
        <CardHeader>
          <h1>Oups... Something went wrong</h1>
        </CardHeader>

        <CardContent>
          <Alert
            variant={'destructive'}
            className='flex gap-3 justify-between items-center'
          >
            <AlertCircle />
            <p>An error occurred</p>
          </Alert>
        </CardContent>
        <CardFooter className='flex gap-4'>
          <Button
            variant={'link'}
            className='dark:text-secondary cursor-pointer'
            onClick={() => navigate({ to: '/' })}
          >
            Go back home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}