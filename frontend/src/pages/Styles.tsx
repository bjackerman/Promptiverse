import { useEffect, useState } from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import { useStyles } from '@/hooks/useStyles';
import { StyleList } from '@/components/StyleList';
import { StyleEditor } from '@/components/StyleEditor';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const StylesLayout = () => {
    const { styles, fetchStyles, deleteStyle } = useStyles();

    useEffect(() => {
        fetchStyles();
    }, [fetchStyles]);

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Style Library</h1>
                <Button asChild>
                    <Link to="/styles/new"><Plus className="mr-2 h-4 w-4" /> New Style</Link>
                </Button>
            </div>
            <StyleList styles={styles} onDelete={deleteStyle} />
        </div>
    );
}

const StyleCreatePage = () => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Style</h1>
            <StyleEditor mode="create" />
        </div>
    );
}

const StyleEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const { getStyle } = useStyles();
    const [style, setStyle] = useState<any>(null);

    useEffect(() => {
        if (id) {
            getStyle(id).then(s => setStyle(s));
        }
    }, [id, getStyle]);

    if (!style) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Style: {style.name}</h1>
            <StyleEditor mode="edit" initialData={style} />
        </div>
    );
}

export default function Styles() {
  return (
    <Routes>
      <Route path="/" element={<StylesLayout />} />
      <Route path="/new" element={<StyleCreatePage />} />
      <Route path="/:id/edit" element={<StyleEditPage />} />
    </Routes>
  );
}
