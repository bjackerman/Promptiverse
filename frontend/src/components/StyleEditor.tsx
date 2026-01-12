import { useState } from 'react';
import { GuidedStyleForm } from './GuidedStyleForm';
import { StyleProfile, useStyles } from '@/hooks/useStyles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

interface StyleEditorProps {
    initialData?: StyleProfile;
    mode: 'create' | 'edit';
}

export function StyleEditor({ initialData, mode }: StyleEditorProps) {
    const { createStyle, updateStyle } = useStyles();
    const navigate = useNavigate();

    // Basic metadata
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");

    // JSON Data for Guided Form
    // We combine intent, negative, and style into one object for the form if we want
    // But the schema splits them. The schema in requirements says `style` is separate.
    // However, the `GuidedStyleForm` typically handles the specialized visual parts.
    // Let's assume GuidedStyleForm handles the `style` object, `intent`, and `negative`.

    const [formData, setFormData] = useState<any>({
        intent: initialData?.intent || {},
        style: initialData?.style || {},
        negative: initialData?.negative || {},
        output: initialData?.style?.output || {} // Sometimes output is root or inside style? Schema says root properties: intent, style, negative, output.
    });
    // Wait, looking at schema:
    // Properties at root: intent, prompt_scaffolding, style, references, negative, output, engine_overrides, safety.
    // So we should manage the whole object structure minus the metadata (name, description, tags, id).

    const handleFormChange = (newData: any) => {
        setFormData(newData);
    };

    const handleSave = async () => {
        const styleProfileData: Partial<StyleProfile> = {
            name,
            description,
            tags: tags.split(",").map(t => t.trim()).filter(Boolean),
            schema_version: "1.0.0",
            ...formData
        };

        if (mode === 'create') {
            await createStyle(styleProfileData);
            navigate('/styles');
        } else if (initialData && (initialData._id || initialData.id)) {
            await updateStyle(initialData._id || initialData.id!, styleProfileData);
            navigate('/styles');
        }
    };

    const handleCopy = () => {
        const styleProfileData = {
            name,
            description,
            tags: tags.split(",").map(t => t.trim()).filter(Boolean),
            schema_version: "1.0.0",
            ...formData
        };
        navigator.clipboard.writeText(JSON.stringify(styleProfileData, null, 2));
        alert("Style JSON copied to clipboard!");
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h2 className="text-xl font-semibold">Style Editor</h2>
                 <Button variant="outline" size="sm" onClick={handleCopy}>
                    Copy JSON
                 </Button>
            </div>
            <div className="grid gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold">Metadata</h2>
                <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Style Name" />
                </div>
                <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
                </div>
                <div>
                    <label className="text-sm font-medium">Tags</label>
                    <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="tag1, tag2" />
                </div>
            </div>

            <GuidedStyleForm data={formData} onChange={handleFormChange} />

            <div className="flex justify-end gap-4">
                 <Button variant="secondary" onClick={() => navigate('/styles')}>Cancel</Button>
                 <Button onClick={handleSave}>Save Style</Button>
            </div>
        </div>
    );
}
