import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShareForm } from '@/components/share-form';

export default function ShareBoost() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Share Boost</h1>
        <p className="text-muted-foreground">Start a new Facebook share boost session</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Share Boost Configuration</CardTitle>
          <CardDescription>
            Configure your Facebook share boost settings below. Make sure to use valid credentials and URLs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ShareForm />
        </CardContent>
      </Card>
    </div>
  );
}