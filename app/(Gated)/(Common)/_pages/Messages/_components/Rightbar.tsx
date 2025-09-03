import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AppDispatch, RootState } from '@/store/store';
import { ChatParticipant, Message } from '@/store/types/api';
import { AlertCircle, Calendar, CheckCircle, FileText, Link2, NotebookIcon, NotebookPen, Plus, Search, Users } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNote, cancelConsultation, getConsultationById, rescheduleConsultation, uploadDocument } from '@/store/reducers/consultationSlice';
import { JSX } from '@fullcalendar/core/preact.js';
import { ConsultationMode } from '@/lib/enums';

// const mockTimeline = [
//     { icon: <Calendar className="w-4 h-4" />, title: 'Consultation Requested', time: '2024-06-01 10:00', action: null },
//     { icon: <CheckCircle className="w-4 h-4 text-green-600" />, title: 'Lawyer Accepted', time: '2024-06-01 10:15', action: null },
//     { icon: <AlertCircle className="w-4 h-4 text-yellow-500" />, title: 'Reschedule Requested', time: '2024-06-02 09:00', action: <Button size="sm" variant="outline">View</Button> },
// ];

// const mockFiles = [
//     { id: 'f1', name: 'Contract.pdf', type: 'pdf', uploader: 'Ali Khan', time: '2d ago' },
//     { id: 'f2', name: 'Evidence.jpg', type: 'image', uploader: 'Sara Ahmed', time: '1d ago' },
// ];
const mockLinks = [
    { id: 'l1', url: 'https://example.com', title: 'Reference Link', sender: 'Sara Ahmed', time: '1d ago' },
];

// Dictionary for human-readable labels
export const ConsultationModeLabels: Record<ConsultationMode, string> = {
    [ConsultationMode.IN_PERSON]: "In Person",
    [ConsultationMode.VIDEO_CALL]: "Video Call",
    [ConsultationMode.PHONE_CALL]: "Phone Call",
    [ConsultationMode.CHAT]: "Chat"
};



const Rightbar = ({ showRightbar }: { showRightbar: boolean, setShowSidebar: (show: boolean) => void }) => {

    const dispatch = useDispatch<AppDispatch>()
    const { messages, currentRoom } = useSelector((state: RootState) => state.chat);
    const { user } = useSelector((state: RootState) => state.auth);
    const [open, setOpen] = useState<string | null>('timeline');
    const [showConsultationModal, setShowConsultationModal] = useState(false);
    const [showAddParticipant, setShowAddParticipant] = useState(false);
    const [note, setNote] = useState('');
    const [rescheduleDate, setRescheduleDate] = useState<string>('');
    const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState<string>('');
    const [rescheduleReason, setRescheduleReason] = useState<string>('');
    const [cancelReason, setCancelReason] = useState<string>('');
    const [cancelNote, setCancelNote] = useState<string>('');
    const [findMessage, setFindMessage] = useState("")
    const [filteredMessages, setFilteredMessages] = useState<Message[]>([])

    // Cancellation reasons enum
    const cancellationReasons = [
        { value: 'client_request', label: 'Client Request' },
        { value: 'lawyer_unavailable', label: 'Lawyer Unavailable' },
        { value: 'emergency', label: 'Emergency' },
        { value: 'technical_issue', label: 'Technical Issue' },
        { value: 'other', label: 'Other' }
    ];
    const { selectedConsultation, isLoading } = useSelector((state: RootState) => state.consultation);
    const noteSaveTimeout = useRef<NodeJS.Timeout | null>(null);

    // derive a small activity timeline
    const timeline = (() => {
        const c = selectedConsultation;
        if (!c) return [];
        const items = [
            { icon: <Calendar className="w-4 h-4" />, title: 'Consultation Requested', time: c.createdAt },
            c.status === 'scheduled' ? { icon: <CheckCircle className="w-4 h-4 text-green-600" />, title: 'Lawyer Confirmed' } : null,
            c.status === 'completed' ? { icon: <CheckCircle className="w-4 h-4 text-green-600" />, title: 'Completed' } : null,
            c.cancelledAt ? { icon: <AlertCircle className="w-4 h-4 text-yellow-500" />, title: 'Cancelled', time: c.cancelledAt } : null,
        ].filter(Boolean) as Array<{ icon: JSX.Element; title: string; time: string }>;
        return items;
    })();


    // Handle Search 
    const handleSearchMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const searchValue = e.target.value;
        setFindMessage(searchValue);

        const words = searchValue.split(" ").filter(Boolean);
        console.log("words", words)
        setFilteredMessages(messages[currentRoom!._id].filter((mess) => {
            return words.some((word) =>
                mess.content.toLowerCase().includes(word.toLowerCase())
            );
        }) || []);
        console.log("filtered messages", filteredMessages)
    };

    // Accordion open logic
    const handleAccordionChange = (key: string) => setOpen(open === key ? null : key);

    // Notepad auto-save debounce
    const handleNoteChange = (v: string) => {
        setNote(v);
        if (noteSaveTimeout.current) clearTimeout(noteSaveTimeout.current);
        noteSaveTimeout.current = setTimeout(async () => {
            if (!currentRoom?.consultation?._id || !v.trim()) return;
            await dispatch(addNote({
                id: currentRoom.consultation._id,
                formData: { content: v.trim(), isPrivate: true },
            }));
            dispatch(getConsultationById(currentRoom.consultation._id));
        }, 600);
    };

    useEffect(() => {
        const latest = (selectedConsultation?.notes || []).slice().reverse().find((n: any) => n?.isPrivate) || null;
        setNote(latest?.content || '');
    }, [selectedConsultation?._id, selectedConsultation?.notes]);


    useEffect(() => {
        if (currentRoom?.consultation._id)
            dispatch(getConsultationById(currentRoom.consultation._id));
    }, [dispatch, currentRoom?.consultation])

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
                <Button size="sm" variant='link' className="w-full" onClick={() => {
                    if (currentRoom?.consultation?._id) {
                        dispatch(getConsultationById(currentRoom.consultation._id));
                    }
                    setShowConsultationModal(true);
                }}>
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
                            <Input value={findMessage} onChange={(e) => handleSearchMessage(e)} placeholder="Search messages..." className="mb-2" />
                            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                                {/* search results */}
                                {filteredMessages.map((mess,index) => {
                                    return <div key={index} className="p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted">{mess.content}<div className="text-xs text-muted-foreground">{mess.sender.firstname} • {new Date(mess.timestamp).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}</div></div>
                                })}
                                {/* <div className="p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted">How do I file a case? <span className="text-xs text-muted-foreground ml-2">10:01 AM</span></div>
                                <div className="p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted">Please see attached contract. <span className="text-xs text-muted-foreground ml-2">Yesterday</span></div> */}
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
                            {/* {mockTimeline.map((e, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    {e.icon}
                                    <div>
                                        <div className="text-sm font-medium">{e.title}</div>
                                        <div className="text-xs text-muted-foreground">{e.time}</div>
                                    </div>
                                    {e.action && <div className="ml-auto">{e.action}</div>}
                                </div>
                            ))} */}
                            {timeline.map((e: any, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    {e.icon}
                                    <div>
                                        <div className="text-sm font-medium">{e.title}</div>
                                        {/* <div className="text-xs text-muted-foreground">{new Date(e.time).toLocaleString()}</div> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Reschedule & Cancel */}
                <AccordionItem value="manage" className="rounded-lg shadow bg-muted">
                    <AccordionTrigger className="px-4 py-3 flex items-center gap-2 hover:no-underline ">
                        <div className="flex justify-start items-center gap-2 w-full">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="font-medium">Reschedule & Cancel</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className={'px-4 transition-all duration-300'}>
                        <div className="flex flex-col gap-4 py-2">
                            <div className="space-y-2">
                                <div className="text-sm font-medium">Reschedule consultation</div>
                                <div className="grid grid-cols-1 gap-2">
                                    <Input
                                        type="date"
                                        value={rescheduleDate}
                                        onChange={(e) => setRescheduleDate(e.target.value)}
                                        className="w-full"
                                    />
                                    <Input
                                        type="time"
                                        value={rescheduleTimeSlot}
                                        onChange={(e) => setRescheduleTimeSlot(e.target.value)}
                                        className="w-full"
                                    />
                                    <Textarea
                                        placeholder="Reason for rescheduling"
                                        value={rescheduleReason}
                                        onChange={(e) => setRescheduleReason(e.target.value)}
                                        className="resize-none"
                                    />
                                    <Button
                                        size="sm"
                                        className="w-full"
                                        disabled={isLoading || !currentRoom?.consultation?._id || !rescheduleDate || !rescheduleTimeSlot || !rescheduleReason}
                                        onClick={async (e: FormEvent) => {
                                            e.preventDefault();
                                            if (!currentRoom?.consultation?._id) return;
                                            const id = currentRoom.consultation._id;
                                            await dispatch(rescheduleConsultation({ id, formData: { id, newDate: rescheduleDate, newTimeSlot: rescheduleTimeSlot, reason: rescheduleReason } }))
                                                .unwrap()
                                                .then(() => dispatch(getConsultationById(id)));
                                        }}
                                    >
                                        {isLoading ? 'Rescheduling...' : 'Reschedule'}
                                    </Button>
                                </div>
                            </div>

                            <div className="h-px bg-border" />

                            <div className="space-y-2">
                                <div className="text-sm font-medium">Cancel consultation</div>
                                <div className="grid grid-cols-1 gap-2">
                                    <Select value={cancelReason} onValueChange={setCancelReason}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select cancellation reason" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cancellationReasons.map((reason) => (
                                                <SelectItem key={reason.value} value={reason.value}>
                                                    {reason.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Textarea
                                        placeholder="Cancel Reason Explanation"
                                        value={cancelNote}
                                        onChange={(e) => setCancelNote(e.target.value)}
                                        className="resize-none"
                                    />
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="w-full"
                                        disabled={isLoading || !currentRoom?.consultation?._id || !cancelReason || !cancelNote}
                                        onClick={async (e: FormEvent) => {
                                            e.preventDefault()
                                            if (!currentRoom?.consultation?._id) return;
                                            const id = currentRoom.consultation._id;
                                            await dispatch(cancelConsultation({ id, reason: cancelReason, note: cancelNote || undefined }))
                                                .unwrap()
                                                .then(() => dispatch(getConsultationById(id)));
                                        }}
                                    >
                                        {isLoading ? 'Cancelling...' : 'Cancel Consultation'}
                                    </Button>
                                </div>
                            </div>
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
                                    {/* {mockFiles.map(f => (
                                        <div key={f.id} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">{f.name}</div>
                                                <div className="text-xs text-muted-foreground">{f.uploader} • {f.time}</div>
                                            </div>
                                        </div>
                                    ))} */}
                                    <div className="flex flex-col gap-2">
                                        {(selectedConsultation?.documents || []).map((doc: any) => (
                                            <div key={doc._id || doc.url} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                                                <FileText className="w-4 h-4 text-primary" />
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium truncate">{doc.name || doc.title || doc.fileName}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {(doc.fileType || '').toUpperCase()} • {Math.round((doc.fileSize || 0) / 1024)} KB
                                                    </div>
                                                </div>
                                                {doc.url && (
                                                    <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs text-primary underline">Open</a>
                                                )}
                                            </div>
                                        ))}
                                        <Button onClick={() => { }}>Upload file</Button>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="links">
                                <div className="flex flex-col gap-2">
                                    { }
                                    {mockLinks.map(l => (
                                        <div key={l.id} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                                            <Link2 className="w-4 h-4 text-primary" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">{l.title}</div>
                                                <div className="text-xs text-muted-foreground">{l.sender} • {l.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button>Add Link</Button>
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
                            {(selectedConsultation?.notes || []).map((n: any) => (
                                <div key={n.id} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                                    <NotebookIcon className="w-4 h-4 text-primary" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">{n.content}</div>
                                        <div className="text-xs text-muted-foreground">{n.createdBy} • {new Date(n.createdAt).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })}</div>
                                    </div>
                                </div>
                            ))}
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
                    <div className="py-4 space-y-2">
                        {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
                        {!!selectedConsultation && (
                            <div className="space-y-2 text-sm">
                                <div><span className="font-medium">Status:</span> {selectedConsultation.status}</div>
                                <div><span className="font-medium">Type:</span> {selectedConsultation.type} • <span className="font-medium">Mode:</span> {ConsultationModeLabels[selectedConsultation.mode]}</div>
                                <div><span className="font-medium">Scheduled:</span> {new Date(selectedConsultation.scheduledDate).toLocaleString()}</div>
                                <div><span className="font-medium">Duration:</span> {selectedConsultation.duration} min</div>
                                <div><span className="font-medium">Fee:</span> {selectedConsultation.fee}</div>
                                {selectedConsultation.location && <div><span className="font-medium">Location:</span> {selectedConsultation.location}</div>}
                                {selectedConsultation.meetingLink && <div><span className="font-medium">Meeting Link:</span> <a className="underline text-primary" href={selectedConsultation.meetingLink} target="_blank" rel="noreferrer">Open</a></div>}
                                {selectedConsultation.phoneNumber && <div><span className="font-medium">Phone:</span> {selectedConsultation.phoneNumber}</div>}
                                {selectedConsultation.description && <div><span className="font-medium">Description:</span> {selectedConsultation.description}</div>}
                                {selectedConsultation.clientNotes && <div><span className="font-medium">Client Notes:</span> {selectedConsultation.clientNotes}</div>}
                                {selectedConsultation.lawyerNotes && <div><span className="font-medium">Lawyer Notes:</span> {selectedConsultation.lawyerNotes}</div>}
                                <div><span className="font-medium">Documents:</span> {(selectedConsultation.documents || []).length}</div>
                                <div><span className="font-medium">Created:</span> {new Date(selectedConsultation.createdAt).toLocaleString()}</div>
                            </div>
                        )}
                        {!isLoading && !selectedConsultation && <div className="text-sm text-muted-foreground">No details found.</div>}
                    </div>
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