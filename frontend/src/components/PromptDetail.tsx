
import { Prompt } from '@/hooks/usePrompts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Copy, Download } from 'lucide-react';

interface PromptDetailProps {
  prompt: Prompt;
  styleName?: string;
}

export function PromptDetail({ prompt, styleName }: PromptDetailProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(prompt, null, 2));
    alert("Prompt JSON copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(prompt, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prompt.title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{prompt.title}</h1>
        <div className="space-x-2">
            <Button variant="outline" onClick={handleCopy} title="Copy JSON">
                <Copy className="h-4 w-4 mr-2" /> Copy
            </Button>
            <Button variant="outline" onClick={handleDownload} title="Download JSON">
                <Download className="h-4 w-4 mr-2" /> Download
            </Button>
            <Button asChild variant="outline">
                <Link to={`/prompts/${prompt._id || prompt.id}/edit`}>Edit</Link>
            </Button>
            <Button asChild variant="secondary">
                 <Link to="/prompts">Back to List</Link>
            </Button>
        </div>
      </div>

      <div className="flex gap-2">
         <Badge>{prompt.modal_type}</Badge>
         {styleName && <Badge variant="outline">Style: {styleName}</Badge>}
         {prompt.tags?.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
            <p>{prompt.description || "No description provided."}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
            <pre className="bg-slate-100 p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(prompt.content, null, 2)}
            </pre>
        </CardContent>
      </Card>

      {(prompt as any).metadata && Object.keys((prompt as any).metadata).length > 0 && (
         <Card>
            <CardHeader>
                <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent>
                 <pre className="bg-slate-100 p-4 rounded-md overflow-auto text-sm">
                    {JSON.stringify((prompt as any).metadata, null, 2)}
                </pre>
            </CardContent>
         </Card>
      )}
    </div>
  );
}
