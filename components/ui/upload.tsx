import { AlertCircle, FileText, X, UploadIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UploadProps {
    multiple?: boolean;
    accept?: string;
    value?: File[];
    onChange?: (files: File[]) => void;
    disabled?: boolean;
    maxSizeMB?: number;
    className?: string;
    helperText?: string;
}

const DEFAULT_ACCEPT = '.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp';
const DEFAULT_MAX_SIZE_MB = 5;

const Upload: React.FC<UploadProps> = ({
    multiple = false,
    accept = DEFAULT_ACCEPT,
    value = [],
    onChange,
    disabled = false,
    maxSizeMB = DEFAULT_MAX_SIZE_MB,
    className = '',
    helperText = 'Supported formats: PDF, DOC, DOCX, Images. Maximum size: 5MB',
}) => {

    //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previews, setPreviews] = useState<{ [key: string]: string }>({});

    //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
    // Calculate total uploaded size in MB
    const totalSizeMB = value.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024;
    const sizeDisplay = `${totalSizeMB.toFixed(2)} / ${maxSizeMB} MB used`;
    const overLimit = totalSizeMB > maxSizeMB;

    //////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
    // Warn if value or onChange is missing
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            if (onChange === undefined) {
                console.warn('Upload component: onChange prop is required for controlled usage.');
            }
        }
    }, [onChange]);

    // Generate previews for images
    useEffect(() => {
        let isMounted = true;
        const newPreviews: { [key: string]: string } = {};
        const filesToPreview = value.filter(file => file.type.startsWith('image/'));
        if (filesToPreview.length === 0) {
            setPreviews({});
            return;
        }
        filesToPreview.forEach(file => {
            const key = file.name + file.size + file.lastModified;
            const reader = new FileReader();
            reader.onload = e => {
                if (e.target?.result && isMounted) {
                    newPreviews[key] = e.target.result as string;
                    setPreviews(prev => ({ ...prev, [key]: e.target?.result as string }));
                }
            };
            reader.readAsDataURL(file);
        });
        // Clean up previews for removed files
        setPreviews(prev => {
            const validKeys = filesToPreview.map(f => f.name + f.size + f.lastModified);
            const filtered: { [key: string]: string } = {};
            for (const k of validKeys) {
                if (prev[k]) filtered[k] = prev[k];
            }
            return filtered;
        });
        return () => { isMounted = false; };
    }, [value]);

    //////////////////////////////////////////////// HANDLERS /////////////////////////////////////////////////
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFiles = (files: File[]) => {
        setError(null);
        let validFiles = files;
        if (!multiple) validFiles = files.slice(0, 1);
        const tooLarge = validFiles.find(f => f.size > (maxSizeMB * 1024 * 1024));
        if (tooLarge) {
            setError(`File "${tooLarge.name}" exceeds ${maxSizeMB}MB limit.`);
            return;
        }
        if (onChange) {
            if (multiple) {
                // Merge with existing files, avoid duplicates by name+size+lastModified
                const merged = [...value, ...validFiles].filter((file, idx, arr) =>
                    arr.findIndex(f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified) === idx
                );
                onChange(merged);
            } else {
                onChange(validFiles);
            }
        }
        // Reset file input so same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleRemove = (idx: number) => {
        if (onChange) {
            onChange(value.filter((_, i) => i !== idx));
        }
    };

    //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
    return (
        <div className={className}>
            {/* Always show upload box for multiple, only show for single if no file selected */}
            {(multiple || (!multiple && value.length === 0)) && (
                <div
                    className={`border-2 border-dashed rounded-lg px-6 py-10 text-center transition-colors ${dragActive
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div onClick={() => fileInputRef.current?.click()} className="space-y-2 cursor-pointer">
                        <UploadIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Choose file{multiple ? 's' : ''} or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {sizeDisplay}
                            </p>
                        </div>
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept={accept}
                            multiple={multiple}
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={disabled}
                        />
                    </div>
                </div>
            )}
            {/* For multiple, show file list below. For single, show file in box. */}
            {multiple ? (
                value && value.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                        {value.map((file, idx) => {
                            const key = file.name + file.size + file.lastModified;
                            return (
                                <div key={key} className="flex items-center gap-3 border border-border rounded-lg p-2 w-fit">
                                    {file.type.startsWith('image/') && previews[key] ? (
                                        <Image
                                            src={previews[key]}
                                            alt={file.name}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 object-cover rounded border"
                                        />
                                    ) : (
                                        <FileText className="h-8 w-8 text-primary" />
                                    )}
                                    <div className="break-all truncate max-w-[180px] w-full text-left min-w-0">
                                        <p className="font-medium text-foreground">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => handleRemove(idx)} disabled={disabled}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )
            ) : (
                value && value.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {value.map((file, idx) => {
                            const key = file.name + file.size + file.lastModified;
                            return (
                                <div key={key} className="flex items-center gap-3">
                                    {file.type.startsWith('image/') && previews[key] ? (
                                        <Image
                                            src={previews[key]}
                                            alt={file.name}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 object-cover rounded border"
                                        />
                                    ) : (
                                        <FileText className="h-8 w-8 text-primary" />
                                    )}
                                    <div className="break-all truncate max-w-[180px] w-full text-left min-w-0">
                                        <p className="font-medium text-foreground">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => handleRemove(idx)} disabled={disabled}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <AlertCircle className="h-3 w-3" />
                <span>{helperText}</span>
                {error && <span className="text-red-500 ml-2">{error}</span>}
                {overLimit && <span className="text-red-500 ml-2">Over limit!</span>}
            </div>
        </div>
    );
};

export default Upload;