import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface ChatSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ChatSettingsModal: React.FC<ChatSettingsModalProps> = ({ open, onOpenChange }) => {

    const [settings, setSettings] = useState({ soundNotifications: true, enterToSend: true, showTypingIndicator: true, showReadReceipts: true, linkPreviews: true, });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chat Settings</DialogTitle>
                    <DialogDescription>
                        Customize your messaging experience
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="sound" className="text-sm font-medium">
                            Sound notifications
                        </Label>
                        <Switch
                            id="sound"
                            checked={settings.soundNotifications}
                            onCheckedChange={() => handleToggle('soundNotifications')}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="enter" className="text-sm font-medium">
                            Press Enter to send
                        </Label>
                        <Switch
                            id="enter"
                            checked={settings.enterToSend}
                            onCheckedChange={() => handleToggle('enterToSend')}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="typing" className="text-sm font-medium">
                            Show typing indicator
                        </Label>
                        <Switch
                            id="typing"
                            checked={settings.showTypingIndicator}
                            onCheckedChange={() => handleToggle('showTypingIndicator')}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="receipts" className="text-sm font-medium">
                            Show read receipts
                        </Label>
                        <Switch
                            id="receipts"
                            checked={settings.showReadReceipts}
                            onCheckedChange={() => handleToggle('showReadReceipts')}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="previews" className="text-sm font-medium">
                            Link previews
                        </Label>
                        <Switch
                            id="previews"
                            checked={settings.linkPreviews}
                            onCheckedChange={() => handleToggle('linkPreviews')}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ChatSettingsModal;
