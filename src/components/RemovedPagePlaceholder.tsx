import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function RemovedPagePlaceholder() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-20rem)] py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-headline mt-4">Feature Removed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This part of the application required a server and has been removed to allow for static deployment on the current plan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
