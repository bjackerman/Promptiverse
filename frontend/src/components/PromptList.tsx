
import { Prompt } from '@/hooks/usePrompts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';

interface PromptListProps {
  prompts: Prompt[];
  onDelete: (id: string) => void;
}

export function PromptList({ prompts, onDelete }: PromptListProps) {
  if (prompts.length === 0) {
    return <div className="text-center py-10">No prompts found. Create one!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prompts.map((prompt) => (
        <Card key={prompt._id || prompt.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg truncate">{prompt.title}</CardTitle>
              <Badge variant="outline">{prompt.modal_type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-gray-500 line-clamp-3">
              {prompt.description || JSON.stringify(prompt.content)}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {prompt.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
             <Button variant="ghost" size="sm" asChild>
                <Link to={`/prompts/${prompt._id || prompt.id}`}>View</Link>
             </Button>
             <div className="flex gap-2">
               <Button variant="ghost" size="icon" asChild>
                  <Link to={`/prompts/${prompt._id || prompt.id}/edit`}><Edit className="h-4 w-4" /></Link>
               </Button>
               <Button variant="ghost" size="icon" onClick={() => onDelete((prompt._id || prompt.id)!)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
               </Button>
             </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
