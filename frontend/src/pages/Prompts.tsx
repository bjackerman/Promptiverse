import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { usePrompts } from '@/hooks/usePrompts';
import { PromptList } from '@/components/PromptList';
import { PromptForm } from '@/components/PromptForm';
import { PromptDetail } from '@/components/PromptDetail';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Prompt } from '@/hooks/usePrompts';

// We need useStyles to get style names for dropdowns
// I'll create a mock hook or minimal version if not yet created, but better to just fetch them inside the component or assume they are available.
// For now, I'll fetch styles if I can, but since useStyles is not created yet, I will pass empty array or fetch inside.
// Actually, I can create a temporary api call here or just wait for next step.
// I will create a placeholder for styles loading.
import api from '@/lib/api';

const PromptsLayout = () => {
    const { prompts, fetchPrompts, deletePrompt } = usePrompts();

    useEffect(() => {
        fetchPrompts();
    }, [fetchPrompts]);

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Prompts</h1>
                <Button asChild>
                    <Link to="/prompts/new"><Plus className="mr-2 h-4 w-4" /> New Prompt</Link>
                </Button>
            </div>
            <PromptList prompts={prompts} onDelete={deletePrompt} />
        </div>
    );
}

const PromptCreatePage = () => {
    const { createPrompt } = usePrompts();
    const navigate = useNavigate();
    const [styles, setStyles] = useState<any[]>([]);

    useEffect(() => {
        api.get('/styles').then(res => setStyles(res.data)).catch(console.error);
    }, []);

    const handleSubmit = async (data: Partial<Prompt>) => {
        await createPrompt(data);
        navigate('/prompts');
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create Prompt</h1>
            <PromptForm onSubmit={handleSubmit} styles={styles} />
        </div>
    );
}

const PromptEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const { getPrompt, updatePrompt } = usePrompts();
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [styles, setStyles] = useState<any[]>([]);

    useEffect(() => {
        if (id) {
            getPrompt(id).then(p => setPrompt(p));
            api.get('/styles').then(res => setStyles(res.data)).catch(console.error);
        }
    }, [id, getPrompt]);

    const handleSubmit = async (data: Partial<Prompt>) => {
        if (id) {
            await updatePrompt(id, data);
            navigate(`/prompts/${id}`);
        }
    };

    if (!prompt) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Prompt</h1>
            <PromptForm initialData={prompt} onSubmit={handleSubmit} styles={styles} />
        </div>
    );
}

const PromptDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { getPrompt } = usePrompts();
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [styleName, setStyleName] = useState<string | undefined>();

    useEffect(() => {
        if (id) {
            getPrompt(id).then(async (p) => {
                setPrompt(p);
                if (p?.style_profile_id) {
                    try {
                        const res = await api.get(`/styles/${p.style_profile_id}`);
                        setStyleName(res.data.name);
                    } catch (e) { /* ignore */ }
                }
            });
        }
    }, [id, getPrompt]);

    if (!prompt) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <PromptDetail prompt={prompt} styleName={styleName} />
        </div>
    );
}

export default function Prompts() {
  return (
    <Routes>
      <Route path="/" element={<PromptsLayout />} />
      <Route path="/new" element={<PromptCreatePage />} />
      <Route path="/:id" element={<PromptDetailPage />} />
      <Route path="/:id/edit" element={<PromptEditPage />} />
    </Routes>
  );
}
