import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const TagInput = ({ onChange, value, placeholder }: { onChange: (tags: string[]) => void, value: string[], placeholder: string }) => {
    const [tagString, setTagString] = useState<string>('');
    const [tags, setTags] = useState<string[]>(value);

    // Always call onChange with the union of tags and tagString split by comma
    useEffect(() => {
        const pending = tagString
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);
        const all = Array.from(new Set([...tags, ...pending]));
        onChange(all);
    }, [tags, tagString, onChange]);

    const onEnter = () => {
        setTags(pre => Array.from(new Set([...pre, ...tagString.split(',').map(t => t.trim()).filter(Boolean)])));
        setTagString('');
    };
    const onTagStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTagString(value);
    };

    // Remove confirmed tag
    const removeTag = (idx: number) => {
        setTags(prev => prev.filter((_, i) => i !== idx));
    };

    // Remove pending tag (from tagString)
    const removePendingTag = (tag: string) => {
        const pending = tagString
            .split(',')
            .map(t => t.trim())
            .filter(Boolean)
            .filter((t, i, arr) => !!t && !tags.includes(t) && arr.indexOf(t) === i);
        const newPending = pending.filter(t => t !== tag);
        setTagString(newPending.join(', '));
    };

    return (
        <div className='w-full' >
            <Input
                id="tags"
                value={tagString}
                onChange={onTagStringChange}
                onKeyDown={(e) => { if (e.key === 'Enter') onEnter() }}
                placeholder={placeholder || "Add tag..."}
                className="w-full"
            />
            <div className="flex flex-wrap gap-2 mt-1">
                {tags
                    .map((t: string) => t.trim())
                    .filter(Boolean)
                    .map((tag, i) => (
                        <span
                            key={tag + i}
                            className="inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium"
                        >
                            {tag}
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="ml-1 h-4 w-4 p-0"
                                onClick={() => removeTag(i)}
                                tabIndex={-1}
                            >
                                <X className="w-2.5 h-2.5" />
                            </Button>
                        </span>
                    ))}
                {tagString.split(',')
                    .map((t: string) => t.trim())
                    .filter((t, i, arr) => !!t && !tags.includes(t) && arr.indexOf(t) === i)
                    .map((tag, i) => (
                        <span
                            key={tag + i + 'pending'}
                            className="inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium opacity-60"
                        >
                            {tag}
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="ml-1 h-4 w-4 p-0"
                                onClick={() => removePendingTag(tag)}
                                tabIndex={-1}
                            >
                                <X className="w-2.5 h-2.5" />
                            </Button>
                        </span>
                    ))}
            </div>
        </div>
    );
};

export default TagInput;