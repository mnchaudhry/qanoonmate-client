"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { IConsultation } from "@/store/types/consultation.types";
import { MessageSquare, Plus, Lock, Unlock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface NotesProps {
  consultation: IConsultation;
  onAddNote?: (content: string, isPrivate: boolean) => void;
  loading?: boolean;
}

export default function Notes({ consultation, onAddNote, loading }: NotesProps) {
  const [newNote, setNewNote] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);

  const handleAddNote = () => {
    if (newNote.trim() && onAddNote) {
      onAddNote(newNote, isPrivate);
      setNewNote("");
      setIsPrivate(false);
      setShowAddNote(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Notes</CardTitle>
            <CardDescription className="text-muted-foreground">
              {consultation.notes?.length || 0} note{(consultation.notes?.length || 0) !== 1 ? 's' : ''} added
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => setShowAddNote(!showAddNote)}
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Note Form */}
        {showAddNote && (
          <div className="p-4 bg-surface rounded-lg border border-border space-y-3">
            <Textarea
              placeholder="Write your note here..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="private"
                  checked={isPrivate}
                  onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
                />
                <Label
                  htmlFor="private"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Make this note private (only visible to you)
                </Label>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowAddNote(false);
                    setNewNote("");
                    setIsPrivate(false);
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || loading}
                >
                  Save Note
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Notes List */}
        {consultation.notes && consultation.notes.length > 0 ? (
          <div className="space-y-3">
            {consultation.notes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-surface rounded-lg border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {note.createdBy === 'lawyer' ? 'You' : 'Client'}
                    </Badge>
                    {note.isPrivate && (
                      <Badge variant="secondary" className="text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Private
                      </Badge>
                    )}
                    {!note.isPrivate && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        <Unlock className="h-3 w-3 mr-1" />
                        Shared
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(parseISO(note.createdAt.toString()), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No notes added yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add notes to track important details about this consultation
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
