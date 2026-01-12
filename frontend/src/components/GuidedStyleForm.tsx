import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface GuidedStyleFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function GuidedStyleForm({ data, onChange }: GuidedStyleFormProps) {
    const handleChange = (section: string, key: string, value: any) => {
        const newData = { ...data };
        if (section === 'root') {
             newData[key] = value;
        } else {
             if (!newData[section]) newData[section] = {};
             newData[section][key] = value;
        }
        onChange(newData);
    };

    const handleStyleChange = (category: string, key: string, value: any) => {
        const newData = { ...data };
        if (!newData.style) newData.style = {};
        if (!newData.style[category]) newData.style[category] = {};
        newData.style[category][key] = value;
        onChange(newData);
    };

    // Helper for array inputs
    const handleArrayChange = (path: string[], value: string[]) => {
        const newData = { ...data };
        let current = newData;
        for (let i = 0; i < path.length - 1; i++) {
             if (!current[path[i]]) current[path[i]] = {};
             current = current[path[i]];
        }
        current[path[path.length-1]] = value;
        onChange(newData);
    }

    // Helper to add item to array of objects (simplified)
    const addWeightedItem = (path: string[], item: {value: string, weight: number}) => {
         const newData = { ...data };
         let current = newData;
         for (let i = 0; i < path.length - 1; i++) {
              if (!current[path[i]]) current[path[i]] = {};
              current = current[path[i]];
         }
         const key = path[path.length-1];
         if (!current[key]) current[key] = [];
         current[key] = [...current[key], item];
         onChange(newData);
    }

    const removeWeightedItem = (path: string[], index: number) => {
        const newData = { ...data };
        let current = newData;
        for (let i = 0; i < path.length - 1; i++) {
             if (!current[path[i]]) current[path[i]] = {};
             current = current[path[i]];
        }
        const key = path[path.length-1];
        if (current[key]) {
             current[key] = current[key].filter((_: any, i: number) => i !== index);
             onChange(newData);
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <Tabs defaultValue="intent" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="intent">Intent</TabsTrigger>
                        <TabsTrigger value="aesthetic">Aesthetic</TabsTrigger>
                        <TabsTrigger value="palette">Palette</TabsTrigger>
                        <TabsTrigger value="lighting">Lighting</TabsTrigger>
                    </TabsList>

                    <TabsContent value="intent" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Use Case</Label>
                            <Select
                                value={data.intent?.use_case || ""}
                                onValueChange={(v) => handleChange('intent', 'use_case', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select use case" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="style_only">Style Only</SelectItem>
                                    <SelectItem value="style_plus_prompt_template">Style + Prompt Template</SelectItem>
                                    <SelectItem value="postprocess_only">Post-process Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                             <Label>Priority</Label>
                             <Select
                                value={data.intent?.priority || ""}
                                onValueChange={(v) => handleChange('intent', 'priority', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>

                    <TabsContent value="aesthetic" className="space-y-4 py-4">
                        <div className="space-y-4">
                             <Label>Movements</Label>
                             <WeightedStringInput
                                items={data.style?.aesthetic?.movements || []}
                                onAdd={(item) => addWeightedItem(['style', 'aesthetic', 'movements'], item)}
                                onRemove={(index) => removeWeightedItem(['style', 'aesthetic', 'movements'], index)}
                             />
                        </div>
                        <div className="space-y-4">
                             <Label>Mood</Label>
                             <WeightedStringInput
                                items={data.style?.aesthetic?.mood || []}
                                onAdd={(item) => addWeightedItem(['style', 'aesthetic', 'mood'], item)}
                                onRemove={(index) => removeWeightedItem(['style', 'aesthetic', 'mood'], index)}
                             />
                        </div>
                    </TabsContent>

                    <TabsContent value="palette" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Mode</Label>
                            <Select
                                value={data.style?.palette?.mode || ""}
                                onValueChange={(v) => handleStyleChange('palette', 'mode', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Palette Mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full_color">Full Color</SelectItem>
                                    <SelectItem value="limited_palette">Limited Palette</SelectItem>
                                    <SelectItem value="monochrome">Monochrome</SelectItem>
                                    <SelectItem value="grayscale">Grayscale</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>Temperature</Label>
                            <Select
                                value={data.style?.palette?.temperature || ""}
                                onValueChange={(v) => handleStyleChange('palette', 'temperature', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Temperature" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cool">Cool</SelectItem>
                                    <SelectItem value="neutral">Neutral</SelectItem>
                                    <SelectItem value="warm">Warm</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Simplified color list would go here */}
                    </TabsContent>

                    <TabsContent value="lighting" className="space-y-4 py-4">
                         <div className="space-y-2">
                            <Label>Lighting Setup</Label>
                            <Input
                                placeholder="e.g. Cinematic, Studio, Natural"
                                value={data.style?.lighting?.setup || ""}
                                onChange={(e) => handleStyleChange('lighting', 'setup', e.target.value)}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label>Quality</Label>
                             <Select
                                value={data.style?.lighting?.quality || ""}
                                onValueChange={(v) => handleStyleChange('lighting', 'quality', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Quality" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="soft">Soft</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                    <SelectItem value="dramatic">Dramatic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <div className="border rounded-md p-4 bg-slate-50 overflow-auto h-[500px]">
                <h3 className="text-sm font-semibold mb-2">Live JSON Preview</h3>
                <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    );
}

// Subcomponent for weighted strings (like movements, mood)
function WeightedStringInput({ items, onAdd, onRemove }: {
    items: {value: string, weight: number}[],
    onAdd: (item: {value: string, weight: number}) => void,
    onRemove: (index: number) => void
}) {
    const [val, setVal] = useState("");
    const [weight, setWeight] = useState(1.0);

    const handleAdd = () => {
        if (val.trim()) {
            onAdd({ value: val.trim(), weight });
            setVal("");
            setWeight(1.0);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {items.map((item, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-2">
                        {item.value} <span className="text-xs opacity-70">({item.weight})</span>
                        <X className="h-3 w-3 cursor-pointer" onClick={() => onRemove(idx)} />
                    </Badge>
                ))}
            </div>
            <div className="flex gap-2 items-center">
                <Input
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    placeholder="Value (e.g. film noir)"
                    className="flex-1"
                />
                 <div className="w-24 px-2">
                    <span className="text-xs text-center block mb-1">{weight}</span>
                    <Slider
                        min={-5} max={5} step={0.1}
                        value={[weight]}
                        onValueChange={(v) => setWeight(v[0])}
                    />
                </div>
                <Button type="button" size="sm" onClick={handleAdd}><Plus className="h-4 w-4" /></Button>
            </div>
        </div>
    );
}
