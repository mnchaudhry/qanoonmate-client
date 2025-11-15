import { FileText, Paperclip, Send, Smile, X, Plus, Settings, Sparkles } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import ChatSettingsModal from './ChatSettingsModal'

interface Props {
    selectedFile: any,
    removeFile: any,
    handleFileSelect: any,
    inputRef: any
    messageInput: string
    handleInputChange: any
    handleSendMessage: any
    onEmojiSelect?: (emoji: string) => void
    onAIAssist?: () => void
}

const ChatInput = ({
    selectedFile,
    handleFileSelect,
    removeFile,
    inputRef,
    messageInput,
    handleInputChange,
    handleSendMessage,
    onEmojiSelect,
    onAIAssist
}: Props) => {
    const [showEmoji, setShowEmoji] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const emojiPickerRef = useRef<HTMLDivElement>(null)

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmoji(false)
            }
        }

        if (showEmoji) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showEmoji])

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        if (onEmojiSelect) {
            onEmojiSelect(emojiData.emoji)
        }
        setShowEmoji(false)
    }

    return (
        <div className="relative z-20 bg-background/60 backdrop-blur-sm">
            {/* Emoji Picker */}
            {showEmoji && (
                <div ref={emojiPickerRef} className="absolute bottom-full left-0 mb-2 z-50">
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        autoFocusSearch={false}
                        height={400}
                        width={320}
                    />
                </div>
            )}

            {/* Settings Modal */}
            <ChatSettingsModal
                open={showSettings}
                onOpenChange={setShowSettings}
            />

            {/* File preview */}
            {selectedFile && (
                <div className="flex items-center gap-3 mb-3 p-3 bg-surface/50 rounded-xl shadow-sm animate-fade-in">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                    </div>
                    <button
                        onClick={removeFile}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                        title="Remove file"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Main Input Container */}
            <div className="relative bg-surface/80 rounded-lg">
                {/* Input Field */}
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Send a message..."
                    value={messageInput}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    className="w-full px-4 py-4 bg-transparent focus:outline-none text-sm text-foreground placeholder:text-muted-foreground/60 h-12 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    aria-label="Type a message"
                />

                {/* Action Buttons Row */}
                <div className="flex items-center justify-between px-2 pb-3">
                    {/* Left Actions */}
                    <div className="flex items-center gap-0.5">
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileSelect}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <button
                            onClick={() => document.getElementById("file-upload")?.click()}
                            className="cursor-pointer p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors"
                            title="Upload file"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        <button
                            className="cursor-pointer p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors"
                            title="Attach file"
                            onClick={() => document.getElementById("file-upload")?.click()}
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <button
                            className="cursor-pointer p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors"
                            title="AI text assistance"
                            onClick={onAIAssist}
                        >
                            <Sparkles className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowEmoji((v) => !v)}
                            className="cursor-pointer p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors"
                            title="Add emoji"
                            type="button"
                        >
                            <Smile className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            className="cursor-pointer p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors"
                            title="Settings"
                            onClick={() => setShowSettings(true)}
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleSendMessage}
                            disabled={!messageInput.trim() && !selectedFile}
                            className="cursor-pointer p-1.5 text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
                            title="Send message"
                            type="button"
                            aria-label="Send message"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatInput