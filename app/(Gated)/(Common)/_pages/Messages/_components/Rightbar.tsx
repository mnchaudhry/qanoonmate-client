import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Users, Search, FileText, Link2, NotebookPen, Calendar, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { ChatParticipant } from '@/store/types/api';
import { cn } from '@/lib/utils';

const mockTimeline = [
    { icon: <Calendar className="w-4 h-4" />, title: 'Consultation Requested', time: '2024-06-01 10:00', action: null },
    { icon: <CheckCircle className="w-4 h-4 text-green-600" />, title: 'Lawyer Accepted', time: '2024-06-01 10:15', action: null },
    { icon: <AlertCircle className="w-4 h-4 text-yellow-500" />, title: 'Reschedule Requested', time: '2024-06-02 09:00', action: <Button size="sm" variant="outline">View</Button> },
];

const mockFiles = [
    { id: 'f1', name: 'Contract.pdf', type: 'pdf', uploader: 'Ali Khan', time: '2d ago' },
    { id: 'f2', name: 'Evidence.jpg', type: 'image', uploader: 'Sara Ahmed', time: '1d ago' },
];
const mockLinks = [
    { id: 'l1', url: 'https://example.com', title: 'Reference Link', sender: 'Sara Ahmed', time: '1d ago' },
];

const Rightbar = ({ showRightbar }: { showRightbar: boolean, setShowSidebar: (show: boolean) => void }) => {
    const { currentRoom } = useSelector((state: RootState) => state.chat);
    const { user } = useSelector((state: RootState) => state.auth);
    const [open, setOpen] = useState<string | null>('timeline');
    const [showConsultationModal, setShowConsultationModal] = useState(false);
    const [showAddParticipant, setShowAddParticipant] = useState(false);
    const [note, setNote] = useState('');
    const noteSaveTimeout = useRef<NodeJS.Timeout | null>(null);

    // Accordion open logic
    const handleAccordionChange = (key: string) => setOpen(open === key ? null : key);

    // Notepad auto-save debounce
    const handleNoteChange = (v: string) => {
        setNote(v);
        if (noteSaveTimeout.current) clearTimeout(noteSaveTimeout.current);
        noteSaveTimeout.current = setTimeout(() => {
            // Save note to backend here
        }, 800);
    };

    // Profile section
    const profile = currentRoom?.participants?.find((p: ChatParticipant) => p._id !== user?._id)
    const status = 'Ongoing'; // Placeholder

    return (
        <aside className={cn("relative w-full h-full flex-col z-50 shadow-xl animate-slide-in-right p-4", showRightbar ? "flex" : "hidden")}>
            {/* Top Profile Block */}
            <div className="sticky top-0 z-20 px-6 pb-4 flex flex-col items-center gap-3">
                <Avatar className="w-20 h-20 shadow">
                    <AvatarImage src={profile?.profilePicture} alt={profile?.firstname} />
                    <AvatarFallback className='text-2xl'>{profile?.firstname[0].toUpperCase()}{profile?.lastname[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-lg font-semibold text-foreground capitalize">{profile?.firstname} {profile?.lastname}</div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs px-2 py-0.5 border-green-500 text-green-700">{status}</Badge>
                </div>
                <Button size="sm" variant='link' className="w-full" onClick={() => setShowConsultationModal(true)}>
                    View Consultation Details
                </Button>
            </div>

            {/* Accordions */}
            <Accordion type="single" collapsible value={open || undefined} onValueChange={handleAccordionChange} className="flex-1 overflow-y-auto py-2 space-y-2 custom-scrollbar">

                {/* Search Chat */}
                <AccordionItem value="search" className="rounded-lg shadow bg-muted">
                    <AccordionTrigger className="px-4 py-3 flex items-center gap-2 hover:no-underline">
                        <div className="flex justify-start items-center gap-2 w-full">
                            <Search className="w-4 h-4 text-primary" />
                            <span className="font-medium">Search</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className={'px-4 transition-all duration-300'}>
                        <div className="py-2">
                            <Input placeholder="Search messages..." className="mb-2" />
                            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                                {/* Mock search results */}
                                <div className="p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted">How do I file a case? <span className="text-xs text-muted-foreground ml-2">10:01 AM</span></div>
                                <div className="p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted">Please see attached contract. <span className="text-xs text-muted-foreground ml-2">Yesterday</span></div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Activity Timeline */}
                <AccordionItem value="timeline" className="rounded-lg shadow bg-muted">
                    <AccordionTrigger className="px-4 py-3 flex items-center gap-2 hover:no-underline ">
                        <div className="flex justify-start items-center gap-2 w-full">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="font-medium">Activity Timeline</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className={'px-4 transition-all duration-300'}>
                        <div className="flex flex-col gap-4 py-2 ">
                            {mockTimeline.map((e, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    {e.icon}
                                    <div>
                                        <div className="text-sm font-medium">{e.title}</div>
                                        <div className="text-xs text-muted-foreground">{e.time}</div>
                                    </div>
                                    {e.action && <div className="ml-auto">{e.action}</div>}
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Participants */}
                <AccordionItem value="people" className="rounded-lg shadow bg-muted">
                    <AccordionTrigger className="px-4 py-3 flex items-center gap-2 hover:no-underline">
                        <div className="flex justify-start items-center gap-2 w-full">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="font-medium">People</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className={'px-4 transition-all duration-300'}>
                        <div className="flex flex-wrap gap-3 py-2">
                            {currentRoom?.participants?.map(p => (
                                <div key={p._id} className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={p.profilePicture} alt={p.firstname} />
                                        <AvatarFallback className='bg-neutral text-muted-foreground capitalize text-base'>{p.firstname.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center gap-1">
                                        <div className="text-sm font-medium capitalize ">{p.firstname} {p.lastname}</div>
                                        {p._id === user?._id && <span className="text-xs text-muted-foreground ml-1">(You)</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => setShowAddParticipant(true)}>
                            <Plus className="w-4 h-4 mr-1" /> Add Participant
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                {/* Files & Links */}
                <AccordionItem value="files" className="rounded-lg shadow bg-muted">
                    <AccordionTrigger className="px-4 py-3 flex items-center gap-2 hover:no-underline">
                        <div className="flex justify-start items-center gap-2 w-full">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="font-medium">Files & Links</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className={'px-4 transition-all duration-300'}>
                        <Tabs defaultValue="files" className="w-full">
                            <TabsList className="mb-2 w-full">
                                <TabsTrigger value="files" className='w-full'>Files</TabsTrigger>
                                <TabsTrigger value="links" className='w-full'>Links</TabsTrigger>
                            </TabsList>
                            <TabsContent value="files">
                                <div className="flex flex-col gap-2">
                                    {mockFiles.map(f => (
                                        <div key={f.id} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">{f.name}</div>
                                                <div className="text-xs text-muted-foreground">{f.uploader} • {f.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="links">
                                <div className="flex flex-col gap-2">
                                    {mockLinks.map(l => (
                                        <div key={l.id} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                                            <Link2 className="w-4 h-4 text-primary" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">{l.title}</div>
                                                <div className="text-xs text-muted-foreground">{l.sender} • {l.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </AccordionContent>
                </AccordionItem>

                {/* My Notes */}
                <AccordionItem value="notes" className="rounded-lg shadow bg-muted">
                    <AccordionTrigger className="px-4 py-3 flex items-center gap-2 hover:no-underline">
                        <div className="flex justify-start items-center gap-2 w-full">
                            <NotebookPen className="w-4 h-4 text-primary" />
                            <span className="font-medium">My Notes</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className={'px-4 transition-all duration-300'}>
                        <div className="py-2">
                            <Textarea
                                value={note}
                                onChange={e => handleNoteChange(e.target.value)}
                                placeholder="Write your notes here..."
                                className="resize-none min-h-[160px] w-full focus:outline-none "
                            />
                            <div className="text-xs text-muted-foreground mt-1">Notes are private and auto-saved.</div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Modals */}
            <Dialog open={showConsultationModal} onOpenChange={setShowConsultationModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Consultation Details</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">Consultation details modal (to be implemented)</div>
                </DialogContent>
            </Dialog>
            <Dialog open={showAddParticipant} onOpenChange={setShowAddParticipant}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Participant</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">Add participant modal (to be implemented)</div>
                </DialogContent>
            </Dialog>
        </aside>
    );
};

export default Rightbar;