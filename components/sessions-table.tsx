'use client';

import { useEffect, useState } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api, Session } from '@/lib/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export function SessionsTable() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const data = await api.getSessions();
      setSessions(data);
      setLastUpdated(new Date());
      setError(null);
      
      // Update dashboard stats
      if (typeof document !== 'undefined') {
        const activeSessionsElement = document.getElementById('active-sessions');
        const totalSharesElement = document.getElementById('total-shares');
        
        if (activeSessionsElement) {
          activeSessionsElement.textContent = data.length.toString();
        }
        
        if (totalSharesElement) {
          const totalShares = data.reduce((sum, session) => sum + session.count, 0);
          totalSharesElement.textContent = totalShares.toString();
        }
      }
    } catch (error) {
      setError('Failed to load sessions');
      console.error('Failed to fetch sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchSessions();
  };

  if (error) {
    return (
      <div className="text-center p-8 space-y-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="h-[500px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead className="min-w-[200px]">URL</TableHead>
              <TableHead className="w-32">Progress</TableHead>
              <TableHead className="w-24 text-right">Target</TableHead>
              <TableHead className="w-32 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No active sessions
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => {
                const progress = (session.count / session.target) * 100;
                const timeAgo = formatDistanceToNow(new Date(session.timestamp * 1000), {
                  addSuffix: true,
                });

                return (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">#{session.session}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="space-y-1">
                        <a 
                          href={session.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline block truncate"
                        >
                          {session.url}
                        </a>
                        <p className="text-xs text-muted-foreground">
                          Started {timeAgo}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {session.count.toLocaleString()} / {session.target.toLocaleString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {session.target.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        progress >= 100 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400'
                      }`}>
                        {progress >= 100 ? 'Completed' : 'In Progress'}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}