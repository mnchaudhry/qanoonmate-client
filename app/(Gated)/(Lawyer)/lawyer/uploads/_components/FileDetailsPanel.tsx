import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { File, Folder, Download, Eye, Trash2, Share, Calendar, User, Tag, FileText, Lock, Globe } from 'lucide-react';
import { FileItem } from '../page';

interface FileDetailsPanelProps {
    file: FileItem;
    formatFileSize: (bytes: number) => string;
    onDelete?: (file: FileItem) => void;
}

const FileDetailsPanel: React.FC<FileDetailsPanelProps> = ({ file, formatFileSize, onDelete }) => {

    //////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////
    const getFileIcon = (file: FileItem) => {
        if (file.type === 'folder') {
            return <Folder className="w-12 h-12 text-primary" />;
        }

        switch (file.fileType) {
            case 'pdf':
                return <File className="w-12 h-12 text-destructive" />;
            case 'docx':
                return <File className="w-12 h-12 text-primary" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <File className="w-12 h-12 text-accent-foreground" />;
            default:
                return <File className="w-12 h-12 text-muted-foreground" />;
        }
    };

    const getVisibilityIcon = (visibility: string) => {
        switch (visibility) {
            case 'client':
                return <Globe className="w-5 h-5 text-accent-foreground" />;
            case 'lawyer':
                return <Lock className="w-5 h-5 text-primary" />;
            case 'private':
                return <Lock className="w-5 h-5 text-muted-foreground" />;
            default:
                return <Globe className="w-5 h-5" />;
        }
    };

    const getOwnershipBadge = (uploadedBy: string) => {
        switch (uploadedBy) {
            case 'client':
                return <Badge variant="secondary" className="bg-accent text-accent-foreground">Client</Badge>;
            case 'lawyer':
                return <Badge variant="secondary" className="bg-primary text-primary-foreground">Lawyer</Badge>;
            case 'private':
                return <Badge variant="secondary" className="bg-muted text-muted-foreground">Private</Badge>;
            default:
                return null;
        }
    };

    const getVisibilityBadge = (visibility: string) => {
        switch (visibility) {
            case 'client':
                return <Badge variant="outline" className="text-accent-foreground border-accent">Client Shared</Badge>;
            case 'lawyer':
                return <Badge variant="outline" className="text-primary border-primary">Lawyer Only</Badge>;
            case 'private':
                return <Badge variant="outline" className="text-muted-foreground border-muted">Private</Badge>;
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleAction = (action: string) => {
        switch (action) {
            case 'open':
                console.log('Open file:', file.name);
                break;
            case 'download':
                console.log('Download file:', file.name);
                break;
            case 'share':
                console.log('Share file:', file.name);
                break;
            case 'delete':
                if (onDelete) {
                    onDelete(file);
                }
                break;
        }
    };

    //////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////
    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <CardHeader className="border-b !border-border bg-muted/20">
                <CardTitle className="flex items-center gap-4">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-lg truncate">{file.name}</div>
                        <div className="text-sm text-muted-foreground font-normal truncate">
                            {file.path}
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-auto p-6 space-y-6">
                {/* Actions */}
                <div className="space-y-3">
                    <div className="flex gap-3">
                        <Button onClick={() => handleAction('open')} className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            Open
                        </Button>
                        <Button onClick={() => handleAction('download')} variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={() => handleAction('share')} variant="outline" className="flex-1">
                            <Share className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                        <Button onClick={() => handleAction('delete')} variant="outline" className="flex-1 text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* File Details */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        File Information
                    </h4>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium">Uploaded</div>
                                <div className="text-sm text-muted-foreground">{formatDate(file.uploadedAt)}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium">Uploaded By</div>
                                <div className="mt-1">{getOwnershipBadge(file.uploadedBy)}</div>
                            </div>
                        </div>

                        {file.type === 'file' && file.size && (
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium">Size</div>
                                    <div className="text-sm text-muted-foreground">{formatFileSize(file.size)}</div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            {getVisibilityIcon(file.visibility)}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium">Visibility</div>
                                <div className="mt-1">{getVisibilityBadge(file.visibility)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                {file.tags && file.tags.length > 0 && (
                    <>
                        <Separator />
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Tag className="w-5 h-5 text-muted-foreground" />
                                <span className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    Tags
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {file.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Notes */}
                {file.notes && (
                    <>
                        <Separator />
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-muted-foreground" />
                                <span className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    Notes
                                </span>
                            </div>
                            <div className="bg-muted/30 p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {file.notes}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </div>
    );
};

export default FileDetailsPanel; 