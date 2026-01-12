
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrompts } from '@/hooks/usePrompts';
import { useEffect } from 'react';

export default function Dashboard() {
  const { prompts, fetchPrompts } = usePrompts();

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const stats = {
    total: prompts.length,
    byType: prompts.reduce((acc: any, p) => {
      acc[p.modal_type] = (acc[p.modal_type] || 0) + 1;
      return acc;
    }, {}),
    recent: prompts.slice(0, 5)
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
           <CardHeader>
            <CardTitle>By Type</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="space-y-1">
               {Object.entries(stats.byType).map(([type, count]) => (
                 <li key={type} className="flex justify-between">
                   <span className="capitalize">{type}</span>
                   <span className="font-bold">{String(count)}</span>
                 </li>
               ))}
             </ul>
          </CardContent>
        </Card>

         <Card>
           <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
             <a href="/prompts/new" className="text-blue-500 hover:underline">Create New Prompt</a>
             <a href="/styles/new" className="text-blue-500 hover:underline">Create New Style</a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
