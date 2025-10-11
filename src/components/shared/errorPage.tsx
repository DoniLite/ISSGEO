import { AlertCircle } from 'lucide-react';
import { Alert } from '../ui/alert';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { useNavigate, type ErrorComponentProps } from '@tanstack/react-router';
import { Button } from '../ui/button';

export default function ErrorPage({ error, info, reset }: ErrorComponentProps) {
  const navigate = useNavigate();
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
            <p>An error occurred: {error.name} </p>
            <span className='text-wrap'>{error.message}</span>
            {import.meta.env?.NODE_ENV === 'development' && (
              <>
                <span> stack: {error.stack}</span>
                <span> info: {info?.componentStack}</span>
              </>
            )}
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
          <Button variant={'ghost'} onClick={reset}>
            Reset
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
