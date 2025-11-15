import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AppDispatch, RootState, useAppSelector } from "@/store/store";
import { ChatParticipant, Message } from "@/store/types/api";
import { AlertCircle, Calendar, CheckCircle, FileText, Link2, NotebookIcon, NotebookPen, Search, Users, ExternalLink, Download, Loader2, X, } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNote, cancelConsultation, deleteNote, getConsultationById, rescheduleConsultation, } from "@/store/reducers/consultationSlice";
import { JSX } from "@fullcalendar/core/preact.js";
import { getRoomFiles, getRoomLinks } from "@/store/reducers/chatSlice";
import { CancellationReason } from "@/lib/enums";



const ChatboxRightbar = ({ showRightbar, }: { showRightbar: boolean; setShowSidebar: (show: boolean) => void; }) => {

  /////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { messages, currentRoom, roomFiles, roomLinks, filesLoading, linksLoading, } = useSelector((state: RootState) => state.chat);
  const { user } = useAppSelector(state => state.auth);

  /////////////////////////////////////////////// STATES /////////////////////////////////////////////////
  const [open, setOpen] = useState<string | null>("timeline");
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [note, setNote] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState<string>("");
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState<string>("");
  const [rescheduleReason, setRescheduleReason] = useState<string>("");
  const [cancelReason, setCancelReason] = useState<string>("");
  const [cancelNote, setCancelNote] = useState<string>("");
  const [findMessage, setFindMessage] = useState("");
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  const cancellationReasons = [
    { value: "client_request", label: "Client Request" },
    { value: "lawyer_unavailable", label: "Lawyer Unavailable" },
    { value: "emergency", label: "Emergency" },
    { value: "technical_issue", label: "Technical Issue" },
    { value: "other", label: "Other" },
  ];
  const { selectedConsultation, loading: isLoading } = useAppSelector(state => state.consultation);

  const currentRoomFiles = currentRoom?._id ? roomFiles[currentRoom._id] || [] : [];
  const currentRoomLinks = currentRoom?._id ? roomLinks[currentRoom._id] || [] : [];
  const isFilesLoading = currentRoom?._id ? filesLoading[currentRoom._id] || false : false;
  const isLinksLoading = currentRoom?._id ? linksLoading[currentRoom._id] || false : false;

  const timeline = (() => {
    const c = selectedConsultation;
    if (!c) return [];
    const items = [
      {
        icon: <Calendar className="w-4 h-4" />,
        title: "Consultation Requested",
        time: new Date(c.createdAt!).toLocaleString(),
      },
      c.status === "scheduled"
        ? {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          title: "Lawyer Confirmed",
        }
        : null,
      c.status === "completed"
        ? {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          title: "Completed",
        }
        : null,
      c.cancelledAt
        ? {
          icon: <AlertCircle className="w-4 h-4 text-yellow-500" />,
          title: "Cancelled",
          time: c.cancelledAt,
        }
        : null,
    ].filter(Boolean) as Array<{
      icon: JSX.Element;
      title: string;
      time: string;
    }>;
    return items;
  })();

  /////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleSearchMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setFindMessage(searchValue);

    if (!searchValue.trim() || !currentRoom?._id) {
      setFilteredMessages([]);
      return;
    }

    const words = searchValue.toLowerCase().split(" ").filter(Boolean);
    const roomMessages = messages[currentRoom._id] || [];
    
    const filtered = roomMessages.filter((mess) => {
      return words.some((word) =>
        mess.content.toLowerCase()?.includes(word)
      );
    });
    
    setFilteredMessages(filtered);
  };

  const handleMessageClick = (messageId: string) => {
    // Find the message element and scroll to it
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Highlight the message temporarily
      messageElement.classList.add('bg-primary/20');
      setTimeout(() => {
        messageElement.classList.remove('bg-primary/20');
      }, 2000);
    }
  };

  // Accordion open logic
  const handleAccordionChange = (key: string) =>
    setOpen(open === key ? null : key);

  // Fetch files and links when room changes
  useEffect(() => {
    if (currentRoom?._id) {
      dispatch(getRoomFiles(currentRoom._id));
      dispatch(getRoomLinks(currentRoom._id));
    }
  }, [currentRoom?._id, dispatch]);

  // Refresh files and links when messages change (new file uploaded)
  useEffect(() => {
    if (currentRoom?._id && messages[currentRoom._id]) {
      const roomMessages = messages[currentRoom._id];
      const lastMessage = roomMessages[roomMessages.length - 1];
      
      // If last message is a file, refresh the files list
      if (lastMessage?.type === 'FILE') {
        dispatch(getRoomFiles(currentRoom._id));
      }
      
      // If last message contains links, refresh the links list
      if (lastMessage?.links && lastMessage.links.length > 0) {
        dispatch(getRoomLinks(currentRoom._id));
      }
    }
  }, [messages, currentRoom?._id, dispatch]);

  const handleDownloadFile = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes("pdf"))
      return <FileText className="w-4 h-4 text-red-500" />;
    if (fileType?.includes("image"))
      return <FileText className="w-4 h-4 text-blue-500" />;
    if (fileType?.includes("word"))
      return <FileText className="w-4 h-4 text-blue-600" />;
    if (fileType?.includes("excel") || fileType?.includes("sheet"))
      return <FileText className="w-4 h-4 text-green-600" />;
    return <FileText className="w-4 h-4 text-gray-500" />;
  };

  // Notepad - no auto-save, manual save button instead
  const handleSaveNote = async () => {
    if (!currentRoom?.consultation?._id || !note.trim()) return;
    
    setNoteSaving(true);
    try {
      await dispatch(
        addNote({
          id: currentRoom.consultation._id,
          request: { content: note.trim(), isPrivate: true },
        })
      ).unwrap();
      
      dispatch(getConsultationById({ id: currentRoom.consultation._id }));
      setNoteSaved(true);
      setNoteSaving(false);
      setNote(""); // Clear draft after saving
      
      // Hide saved indicator after 2 seconds
      setTimeout(() => setNoteSaved(false), 2000);
    } catch (err) {
      setNoteSaving(false);
      console.error('Failed to save note:', err);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!currentRoom?.consultation?._id) return;
    
    const confirmed = confirm('Are you sure you want to delete this note?');
    if (!confirmed) return;
    
    try {
      await dispatch(
        deleteNote({
          id: currentRoom.consultation._id,
          noteId,
        })
      ).unwrap();
      
      dispatch(getConsultationById({ id: currentRoom.consultation._id }));
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  // Load draft note from localStorage
  useEffect(() => {
    if (currentRoom?.consultation?._id) {
      const savedDraft = localStorage.getItem(`note-draft-${currentRoom.consultation._id}`);
      if (savedDraft) {
        setNote(savedDraft);
      } else {
        setNote("");
      }
    }
  }, [currentRoom?.consultation?._id]);

  useEffect(() => {
    if (currentRoom?.consultation._id)
      dispatch(getConsultationById({ id: currentRoom.consultation._id }));
  }, [dispatch, currentRoom?.consultation]);

  // Profile section
  const profile = currentRoom?.participants?.find(
    (p: ChatParticipant) => p._id !== user?._id
  );
  const status = "Ongoing"; // Placeholder

  /////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <aside
      className={cn(
        "relative w-full h-full flex-col z-50 animate-slide-in-right p-4",
        showRightbar ? "flex" : "hidden"
      )}
    >
      {/* Top Profile Block */}
      <div className="sticky top-0 z-20 px-4 pb-5 flex flex-col items-center gap-3 bg-surface/30 backdrop-blur-sm rounded-2xl mb-4">
        <div className="pt-6">
          <Avatar className="w-20 h-20 shadow-md">
            <AvatarImage src={profile?.profilePicture} alt={profile?.firstname} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {profile?.firstname[0].toUpperCase()}
              {profile?.lastname[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="text-lg font-semibold text-foreground capitalize">
          {profile?.firstname} {profile?.lastname}
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-xs px-3 py-1 border-green-500/50 text-green-600 bg-green-500/10"
          >
            {status}
          </Badge>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="w-full hover:bg-accent/50"
          onClick={() => {
            if (currentRoom?.consultation?._id) {
              dispatch(getConsultationById({ id: currentRoom.consultation._id }));
            }
            setShowConsultationModal(true);
          }}
        >
          View Consultation Details
        </Button>
      </div>

      {/* Accordions */}
      <Accordion
        type="single"
        collapsible
        value={open || undefined}
        onValueChange={handleAccordionChange}
        className="flex-1 overflow-y-auto space-y-2 custom-scrollbar"
      >
        {/* Search Chat */}
        <AccordionItem value="search" className="rounded-xl bg-background backdrop-blur-sm overflow-hidden border-0">
          <AccordionTrigger className="px-4 py-3.5 flex items-center gap-2 hover:no-underline hover:bg-background/30 transition-colors">
            <div className="flex justify-start items-center gap-2 w-full">
              <Search className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Search</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="py-2">
              <Input
                value={findMessage}
                onChange={(e) => handleSearchMessage(e)}
                placeholder="Search messages..."
                className="mb-2"
              />
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                {findMessage && filteredMessages.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No messages found matching &quot;{findMessage}&quot;
                  </div>
                )}
                {filteredMessages.map((mess) => {
                  const searchTerm = findMessage.toLowerCase();
                  const content = mess.content;
                  const lowerContent = content.toLowerCase();
                  const index = lowerContent.indexOf(searchTerm);
                  
                  // Highlight the search term
                  const beforeMatch = content.substring(0, index);
                  const match = content.substring(index, index + searchTerm.length);
                  const afterMatch = content.substring(index + searchTerm.length);
                  
                  return (
                    <div
                      key={mess._id}
                      className="p-2.5 rounded-lg bg-surface/50 cursor-pointer hover:bg-surface/70 transition-colors"
                      onClick={() => handleMessageClick(mess._id)}
                    >
                      <div className="text-sm">
                        {index >= 0 ? (
                          <>
                            {beforeMatch}
                            <span className="bg-primary/30 font-medium">{match}</span>
                            {afterMatch}
                          </>
                        ) : (
                          content
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="capitalize">{mess.sender.firstname}</span> •{" "}
                        {new Date(mess.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Activity Timeline */}
        <AccordionItem value="timeline" className="rounded-xl bg-background backdrop-blur-sm overflow-hidden border-0">
          <AccordionTrigger className="px-4 py-3.5 flex items-center gap-2 hover:no-underline hover:bg-background/30 transition-colors">
            <div className="flex justify-start items-center gap-2 w-full">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Activity Timeline</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
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
        <AccordionItem value="manage" className="rounded-xl bg-background backdrop-blur-sm overflow-hidden border-0">
          <AccordionTrigger className="px-4 py-3.5 flex items-center gap-2 hover:no-underline hover:bg-background/30 transition-colors">
            <div className="flex justify-start items-center gap-2 w-full">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Reschedule & Cancel</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="flex flex-col gap-4 py-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">
                  Reschedule consultation
                </div>
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
                      await dispatch(
                        rescheduleConsultation({
                          id,
                          request: {
                            newDate: new Date(rescheduleDate),
                            newTimeSlot: rescheduleTimeSlot,
                            reason: rescheduleReason,
                          },
                        })
                      )
                        .unwrap()
                        .then(() => {
                          dispatch(getConsultationById({ id }));
                          // Clear form
                          setRescheduleDate('');
                          setRescheduleTimeSlot('');
                          setRescheduleReason('');
                          // Show success message
                          alert('Reschedule request submitted successfully!');
                        })
                        .catch((err) => {
                          alert(`Failed to reschedule: ${err.message || 'Unknown error'}`);
                        });
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Rescheduling...
                      </>
                    ) : (
                      "Request Reschedule"
                    )}
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
                      e.preventDefault();
                      if (!currentRoom?.consultation?._id) return;
                      
                      // Confirm before canceling
                      const confirmed = confirm('Are you sure you want to cancel this consultation? This action cannot be undone.');
                      if (!confirmed) return;
                      
                      const id = currentRoom.consultation._id;
                      await dispatch(
                        cancelConsultation({
                          id,
                          request: {
                            reason: CancellationReason.CLIENT_REQUEST,
                            note: cancelNote || undefined,
                          },
                        })
                      )
                        .unwrap()
                        .then(() => {
                          dispatch(getConsultationById({ id }));
                          // Clear form
                          setCancelReason('');
                          setCancelNote('');
                          // Show success message
                          alert('Consultation cancelled successfully.');
                        })
                        .catch((err) => {
                          alert(`Failed to cancel: ${err.message || 'Unknown error'}`);
                        });
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Canceling...
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Cancel Consultation
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Participants */}
        <AccordionItem value="people" className="rounded-xl bg-background backdrop-blur-sm overflow-hidden border-0">
          <AccordionTrigger className="px-4 py-3.5 flex items-center gap-2 hover:no-underline hover:bg-background/30 transition-colors">
            <div className="flex justify-start items-center gap-2 w-full">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">People</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="flex flex-wrap gap-3 py-2">
              {currentRoom?.participants?.map((p) => (
                <div key={p._id} className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={p.profilePicture} alt={p.firstname} />
                    <AvatarFallback className="bg-neutral text-muted-foreground capitalize text-base">
                      {p.firstname
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1">
                    <div className="text-sm font-medium capitalize ">
                      {p.firstname} {p.lastname}
                    </div>
                    {p._id === user?._id && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (You)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => setShowAddParticipant(true)}>
                    <Plus className="w-4 h-4 mr-1" /> Add Participant
                </Button> */}
          </AccordionContent>
        </AccordionItem>

        {/* Files & Links */}
        <AccordionItem value="files" className="rounded-xl bg-background backdrop-blur-sm overflow-hidden border-0">
          <AccordionTrigger className="px-4 py-3.5 flex items-center gap-2 hover:no-underline hover:bg-background/30 transition-colors">
            <div className="flex justify-start items-center gap-2 w-full">
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Files & Links</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <Tabs defaultValue="files" className="w-full">
              <TabsList className="mb-2 w-full">
                <TabsTrigger value="files" className="w-full">
                  Files
                </TabsTrigger>
                <TabsTrigger value="links" className="w-full">
                  Links
                </TabsTrigger>
              </TabsList>
              <TabsContent value="files">
                <div className="flex flex-col gap-2">
                  {isFilesLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  )}
                  {!isFilesLoading && currentRoomFiles.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-8">
                      No files shared yet. Upload files through the message box.
                    </div>
                  )}
                  {!isFilesLoading &&
                    currentRoomFiles.map((file) => (
                      <div
                        key={file.messageId}
                        className="flex items-center gap-2 p-3 rounded-lg bg-surface/50 hover:bg-surface/70 transition-colors"
                      >
                        {getFileIcon(file.fileType)}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate" title={file.fileName}>
                            {file.fileName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatFileSize(file.fileSize)}
                            {" • "}
                            <span className="capitalize">
                              {file.sender.firstname} {file.sender.lastname}
                            </span>
                            {" • "}
                            {new Date(file.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(file.fileUrl, "_blank")}
                            className="h-8 w-8 p-0"
                            title="Open file"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleDownloadFile(file.fileUrl, file.fileName)
                            }
                            className="h-8 w-8 p-0"
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="links">
                <div className="flex flex-col gap-2">
                  {isLinksLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  )}
                  {!isLinksLoading && currentRoomLinks.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-8">
                      No links shared yet. Links in messages will appear here.
                    </div>
                  )}
                  {!isLinksLoading &&
                    currentRoomLinks.map((link: any) => (
                      <div
                        key={`${link.messageId}-${link.url}`}
                        className="flex items-center gap-2 p-3 rounded-lg bg-surface/50 hover:bg-surface/70 transition-colors"
                      >
                        <Link2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary hover:underline truncate block"
                            title={link.url}
                          >
                            {link.url}
                          </a>
                          <div className="text-xs text-muted-foreground">
                            <span className="capitalize">
                              {link.sender.firstname} {link.sender.lastname}
                            </span>
                            {" • "}
                            {new Date(link.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(link.url, "_blank")}
                          className="h-8 w-8 p-0 flex-shrink-0"
                          title="Open link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>

        {/* My Notes */}
        <AccordionItem value="notes" className="rounded-xl bg-background backdrop-blur-sm overflow-hidden border-0">
          <AccordionTrigger className="px-4 py-3.5 flex items-center gap-2 hover:no-underline hover:bg-background/30 transition-colors">
            <div className="flex justify-start items-center gap-2 w-full">
              <NotebookPen className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">My Notes</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="py-2 space-y-3">
              {/* Saved notes list */}
              {(selectedConsultation?.notes || [])
                .filter((n: any) => n.isPrivate)
                .map((n: any) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-2 p-3 rounded-lg bg-surface/50 border border-border"
                  >
                    <NotebookIcon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium whitespace-pre-wrap break-words">{n.content}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {n.createdBy} •{" "}
                        {new Date(n.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteNote(n.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

              {/* Note input area */}
              <div className="space-y-2">
                <Textarea
                  value={note}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setNote(newValue);
                    // Save draft to localStorage
                    if (currentRoom?.consultation?._id) {
                      localStorage.setItem(`note-draft-${currentRoom.consultation._id}`, newValue);
                    }
                  }}
                  placeholder="Write your notes here..."
                  className="resize-none min-h-[120px] w-full"
                />
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Notes are private to you
                  </div>
                  <div className="flex items-center gap-2">
                    {noteSaved && !noteSaving && (
                      <span className="text-xs text-primary flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Saved
                      </span>
                    )}
                    <Button
                      size="sm"
                      onClick={handleSaveNote}
                      disabled={noteSaving || !note.trim()}
                      className="h-8"
                    >
                      {noteSaving ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Note"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Modals */}
      <Dialog
        open={showConsultationModal}
        onOpenChange={setShowConsultationModal}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Consultation Details</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            {isLoading && (
              <div className="text-sm text-muted-foreground">Loading...</div>
            )}
            {!!selectedConsultation && (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  {selectedConsultation.status}
                </div>
                <div>
                  <span className="font-medium">Type:</span>{" "}
                  {selectedConsultation.type}
                </div>
                <div>
                  <span className="font-medium">Scheduled:</span>{" "}
                  {new Date(
                    selectedConsultation.scheduledDate
                  ).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Duration:</span>{" "}
                  {selectedConsultation.duration} min
                </div>
                <div>
                  <span className="font-medium">Fee:</span>{" "}
                  {selectedConsultation.fee}
                </div>
                {selectedConsultation.location && (
                  <div>
                    <span className="font-medium">Location:</span>{" "}
                    {selectedConsultation.location}
                  </div>
                )}
                {selectedConsultation.meetingLink && (
                  <div>
                    <span className="font-medium">Meeting Link:</span>{" "}
                    <a
                      className="underline text-primary"
                      href={selectedConsultation.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  </div>
                )}
                {selectedConsultation.description && (
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedConsultation.description}
                  </div>
                )}
                {selectedConsultation.description && (
                  <div>
                    <span className="font-medium">Description:</span>{" "}
                    {selectedConsultation.description}
                  </div>
                )}
                {selectedConsultation.clientNotes && (
                  <div>
                    <span className="font-medium">Client Notes:</span>{" "}
                    {selectedConsultation.clientNotes}
                  </div>
                )}
                {selectedConsultation.lawyerNotes && (
                  <div>
                    <span className="font-medium">Lawyer Notes:</span>{" "}
                    {selectedConsultation.lawyerNotes}
                  </div>
                )}
                <div>
                  <span className="font-medium">Documents:</span>{" "}
                  {(selectedConsultation.documents || []).length}
                </div>
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(selectedConsultation.createdAt!).toLocaleString()}
                </div>
              </div>
            )}
            {!isLoading && !selectedConsultation && (
              <div className="text-sm text-muted-foreground">
                No details found.
              </div>
            )}
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

export default ChatboxRightbar;
