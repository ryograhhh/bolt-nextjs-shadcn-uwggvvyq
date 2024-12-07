import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SessionsTable } from '@/components/sessions-table';

export default function Sessions() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Sessions</h1>
        <p className="text-muted-foreground">View and monitor all your boost sessions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <CardDescription>
            Track the progress and status of all your share boost sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SessionsTable />
        </CardContent>
      </Card>
    </div>
  );
}