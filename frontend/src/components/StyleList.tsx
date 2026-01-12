
import { StyleProfile } from '@/hooks/useStyles';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';

interface StyleListProps {
  styles: StyleProfile[];
  onDelete: (id: string) => void;
}

export function StyleList({ styles, onDelete }: StyleListProps) {
  if (styles.length === 0) {
    return <div className="text-center py-10">No styles found. Create one!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {styles.map((style) => (
        <Card key={style._id || style.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg truncate">{style.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
             <p className="text-sm text-gray-500 line-clamp-3">
              {style.description || "No description"}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {style.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
             <Button variant="ghost" size="sm" asChild>
                <Link to={`/styles/${style._id || style.id}/edit`}>Edit / View</Link>
             </Button>
             <div className="flex gap-2">
               <Button variant="ghost" size="icon" onClick={() => onDelete((style._id || style.id)!)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
               </Button>
             </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
