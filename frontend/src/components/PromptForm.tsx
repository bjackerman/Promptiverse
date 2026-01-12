import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Prompt } from '@/hooks/usePrompts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const promptSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  modal_type: z.enum(['text', 'image', 'video', 'code', 'audio', 'other']),
  content_text: z.string().optional(), // Simplified for now, mapped to content object
  tags: z.string().optional(), // Comma separated string for input
  style_profile_id: z.string().optional(),
});

interface PromptFormProps {
  initialData?: Prompt;
  onSubmit: (data: Partial<Prompt>) => void;
  styles?: any[]; // Pass styles for selection
}

export function PromptForm({ initialData, onSubmit, styles = [] }: PromptFormProps) {
  const form = useForm<z.infer<typeof promptSchema>>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      modal_type: initialData?.modal_type || "text",
      content_text: typeof initialData?.content === 'string' ? initialData.content : JSON.stringify(initialData?.content || {}, null, 2),
      tags: initialData?.tags?.join(', ') || "",
      style_profile_id: initialData?.style_profile_id || "",
    },
  });

  function handleSubmit(values: z.infer<typeof promptSchema>) {
    // Transform content and tags
    let content = {};
    try {
        content = JSON.parse(values.content_text || "{}");
    } catch (e) {
        content = { text: values.content_text };
    }

    const tags = values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    onSubmit({
      title: values.title,
      description: values.description,
      modal_type: values.modal_type,
      content,
      tags,
      style_profile_id: values.style_profile_id || undefined,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="My Prompt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Short description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="modal_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="style_profile_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style Profile</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a style (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {styles.map(s => (
                    <SelectItem key={s._id || s.id} value={s._id || s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="content_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (JSON or Text)</FormLabel>
              <FormControl>
                <Textarea className="font-mono" rows={10} placeholder="{ ... }" {...field} />
              </FormControl>
              <FormDescription>
                Enter text or a JSON object representing the prompt content.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="tag1, tag2, tag3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Prompt</Button>
      </form>
    </Form>
  );
}
