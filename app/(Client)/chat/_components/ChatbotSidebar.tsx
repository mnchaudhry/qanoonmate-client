import React, { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { AIChatSession } from "@/store/types/api";
import { deleteSession, getMyChatSessions, renameSession, setCurrentSession, setCurrentSessionId } from "@/store/reducers/aiSessionSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Clock, MessageSquare, Settings, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import AlertModal from "@/components/alert-modal";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface ChatSidebarProps {
  sessionMetadata?: {
    interactionCount: number;
    lastModified: string; // Store as ISO string for serializability
    sessionDuration: number;
  };
}

const ChatbotSidebar: React.FC<ChatSidebarProps> = ({
  sessionMetadata,
}: ChatSidebarProps) => {
  ///////////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { sidebarSessions: sessions, currentSessionId: sessionId } =
    useSelector((state: RootState) => state.aiSession);
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramSessionId = searchParams.get("id");

  ///////////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////////////////////
  const [loading, setLoading] = useState<{
    fetch: boolean;
    rename: boolean;
    delete: boolean;
  }>({ fetch: false, rename: false, delete: false });
  const [renaming, setRenaming] = useState<string>("");
  const [sessionToDelete, setSessionToDelete] = useState<AIChatSession | null>(
    null
  );
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  ///////////////////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (paramSessionId) {
      dispatch(setCurrentSessionId(paramSessionId));
    }
  }, [paramSessionId, dispatch])
  useEffect(() => {
    setLoading((pre) => ({ ...pre, fetch: true }));
    dispatch(getMyChatSessions(user ? user._id : null)).finally(() =>
      setLoading((pre) => ({ ...pre, fetch: false }))
    );
  }, [dispatch, user]);

  ///////////////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////////////////////
  const onRename = (id: string, newTitle: string) => {
    setLoading((pre) => ({ ...pre, rename: true }));
    dispatch(renameSession({ id, title: newTitle })).finally(() =>
      setLoading((pre) => ({ ...pre, rename: false }))
    );

    setRenaming("");
  };

  const handleCreateSession = () => {
    toast.success("Session created successfully");
    router.push("/chat-bot");
  };

  const onChatSelect = (session: AIChatSession) => {
    if (!session) return;
    router.push('/chat-bot?id=' + session._id)
    dispatch(setCurrentSessionId(session._id))
    dispatch(setCurrentSession(session))
  }

  const onDelete = () => {
    if (!sessionToDelete) return toast.error("No session selected to delete.");

    setLoading((pre) => ({ ...pre, delete: true }));
    dispatch(deleteSession(sessionToDelete._id))
      .then(() => {
        setSessionToDelete(null);
        setOpenDeleteModal(false);
      })
      .finally(() => setLoading((pre) => ({ ...pre, delete: false })));
  };

  ///////////////////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////////////////////
  return (
    <>
      <AlertModal
        title={"Delete Session"}
        description={`Are you sure you want to delete the session "${sessionToDelete?.title}"?`}
        onSubmit={onDelete}
        loading={loading.delete}
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      />

      <aside
        className={cn(
          "relative border-r flex flex-col justify-between h-screen overflow-y-auto transition-all duration-200 bg-sidebar border-sidebar-border",
          sidebarOpen
            ? "flex-[2] min-w-[260px]"
            : "flex-[0] w-[64px] min-w-[64px]"
        )}
        style={{
          width: sidebarOpen ? undefined : 64,
          minWidth: sidebarOpen ? 260 : 64,
          maxWidth: sidebarOpen ? 400 : 64,
        }}
      >
        {/* Header: Toggle button and logo side by side in expanded, vertical in mini */}
        <div
          className={cn(
            "sticky top-0 z-20 bg-neutral",
            sidebarOpen
              ? "flex flex-row items-center justify-between pt-4 pb-3 h-[84px] border-b !border-border px-4"
              : "flex flex-col items-center justify-center pt-4 pb-3 px-0"
          )}
        >
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "transition-transform z-40",
              sidebarOpen ? "mr-2" : "mb-2"
            )}
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
          {sidebarOpen ? (
            <div className="flex-1 flex justify-center items-center">
              <Logo size="md" type="green" />
            </div>
          ) : (
            <div>
              <Logo size="sm" type="mini_green" />
            </div>
          )}
        </div>

        {/* Render */}
        {sidebarOpen ? (
          <div className="flex flex-col justify-between h-full gap-4 ">
            <div className="flex flex-col gap-4 p-4">
              {/* Search Bar and New Session Button */}
              <div className="flex items-center gap-2 px-1 sticky top-[64px] bg-neutral z-10 pb-2">
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-md border !border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCreateSession}
                  title="Create new session"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              {/* Session Metadata */}
              {sessionMetadata && sessionMetadata.interactionCount > 0 && (
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="text-sm font-semibold text-primary mb-2">
                    Session Info
                  </h3>
                  <div className="space-y-1.5 text-sm text-primary/80">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" />
                      <span>
                        {sessionMetadata.interactionCount} interactions
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>Last: {format(sessionMetadata.lastModified, 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Sessions */}
              <div className="flex-1">
                
                {loading.fetch ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg hover:bg-accent cursor-pointer text-sm flex justify-between items-center animate-pulse mb-1.5"
                    >
                      <span className="h-3 bg-muted-foreground/30 rounded w-3/4"></span>
                      <div className="w-5 h-5 bg-muted-foreground/20 rounded-full"></div>
                    </div>
                  ))
                ) : (
                  sessions
                    .filter(section =>
                      section.items.some(session =>
                        session.title.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                    )
                    .map((section, index) => (
                      <div key={index} className="mt-4">
                        <h2 className="text-muted-foreground text-xs font-medium mb-2 uppercase tracking-wide">
                          {section.section}
                        </h2>
                        {section.items
                          .filter(session =>
                            session.title.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((session, i) => (
                            <div
                              key={i}
                              onClick={() => onChatSelect(session)}
                              className={cn(
                                "p-2 rounded-lg hover:bg-accent cursor-pointer text-sm flex justify-between items-center mb-1.5 transition-colors",
                                String(sessionId) == String(session._id)
                                  ? "bg-primary/10 text-primary border border-primary/20"
                                  : "bg-transparent"
                              )}
                            >
                              {renaming === session._id ? (
                                <input
                                  autoFocus
                                  defaultValue={session.title}
                                  onKeyDown={e => {
                                    if (e.key === "Enter") {
                                      onRename(session._id, (e.target as HTMLInputElement).value);
                                    }
                                  }}
                                  onBlur={e => onRename(session._id, (e.target as HTMLInputElement).value)}
                                  className={cn(
                                    "w-full bg-transparent border !border-border px-2 py-1 rounded-md text-sm",
                                    loading.rename ? "animate-pulse cursor-not-allowed" : ""
                                  )}
                                  disabled={loading.rename}
                                />
                              ) : (
                                <>
                                  <span className="truncate font-medium">{session.title}</span>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-6 h-6 hover:bg-accent"
                                        onClick={e => e.stopPropagation()}
                                      >
                                        <MoreVertical className="w-3 h-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={e => { e.stopPropagation(); setRenaming(session._id); }}>
                                        Rename
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={e => { e.stopPropagation(); setSessionToDelete(session); setOpenDeleteModal(true); }}>
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </>
                              )}
                            </div>
                          ))}
                      </div>
                    ))    
                )}
              </div>
            </div>

            <div className="mt-4 border-t !border-border pt-3 sticky bottom-0 bg-neutral pb-4">
              <div className="p-2 flex items-center gap-2 hover:bg-accent cursor-pointer rounded-lg transition-colors">
                <Settings className="w-3 h-3" />
                <span className="text-sm font-medium">Settings</span>
              </div>
            </div>
          </div>
        ) : (
          // Mini sidebar: logo and icons in vertical orientation
          <div className="flex flex-col items-center justify-between h-full py-2">
            <div className="flex flex-col items-center gap-4 flex-1">
              <Button
                size="icon"
                variant="outline"
                onClick={handleCreateSession}
                title="Create new session"
                className="mb-2"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                title="Settings"
                className="mb-2"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            <div className="mb-2" />
          </div>
        )}
      </aside>
    </>
  );
};

export default ChatbotSidebar;
