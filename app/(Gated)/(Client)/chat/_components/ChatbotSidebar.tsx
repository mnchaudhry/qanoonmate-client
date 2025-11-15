import React, { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { AIChatSession } from "@/store/types/api";
import {
  deleteSession,
  getMyChatSessions,
  newChat,
  renameSession,
  setCurrentSession,
  setCurrentSessionId,
  setChatMode,
  ChatMode,
} from "@/store/reducers/aiSessionSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import ModeSelector from "./ModeSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Settings,
  Plus,
  ChevronLeft,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import AlertModal from "@/components/alert-modal";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";

interface ChatSidebarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

const ChatbotSidebar: React.FC<ChatSidebarProps> = ({
  sidebarOpen: sidebarOpenProp,
  setSidebarOpen: setSidebarOpenProp,
}: ChatSidebarProps) => {
  ///////////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    sidebarSessions: sessions,
    currentSessionId: sessionId,
    chatMode,
  } = useSelector((state: RootState) => state.aiSession);
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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(
    sidebarOpenProp ?? true
  );

  ///////////////////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////////////////////////
  // keep internal state in sync with controlled prop if provided
  useEffect(() => {
    if (typeof sidebarOpenProp === "boolean") setSidebarOpen(sidebarOpenProp);
  }, [sidebarOpenProp]);

  useEffect(() => {
    if (paramSessionId) {
      dispatch(setCurrentSessionId(paramSessionId));
    }
  }, [paramSessionId, dispatch]);
  useEffect(() => {
    if (!user) return;
    setLoading((pre) => ({ ...pre, fetch: true }));
    dispatch(getMyChatSessions(user._id)).finally(() =>
      setLoading((pre) => ({ ...pre, fetch: false }))
    );
  }, [dispatch, user]);

  ///////////////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////////////////////
  const updateSidebarOpen = (open: boolean) => {
    setSidebarOpen(open);
    if (setSidebarOpenProp) setSidebarOpenProp(open);
  };

  const onRename = (id: string, newTitle: string) => {
    setLoading((pre) => ({ ...pre, rename: true }));
    dispatch(renameSession({ id, title: newTitle })).finally(() =>
      setLoading((pre) => ({ ...pre, rename: false }))
    );

    setRenaming("");
  };

  const handleCreateSession = () => {
    toast.success("Session created successfully");

    router.push("/chat");
    dispatch(newChat());
  };

  const onChatSelect = (session: AIChatSession) => {
    if (!session) return;
    router.push("/chat?id=" + session._id);
    dispatch(setCurrentSessionId(session._id));
    dispatch(setCurrentSession(session));
  };

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

  const handleModeChange = (mode: ChatMode) => {
    dispatch(setChatMode(mode));
    toast.success(
      `Switched to ${mode.charAt(0).toUpperCase() + mode.slice(1)} mode`
    );
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
          // Desktop / tablet behavior
          "hidden md:flex bg-surface relative border-r flex-col justify-between h-screen overflow-hidden transition-all duration-500 ease-in-out border-border shadow-lg",
          sidebarOpen
            ? "md:flex-[2] md:min-w-[260px]"
            : "md:flex-[0] md:w-[64px] md:min-w-[64px]",
          // Mobile overlay behavior
          "md:static md:translate-x-0 md:shadow-none"
        )}
        style={{
          width: sidebarOpen ? undefined : 64,
          minWidth: sidebarOpen ? 300 : 64,
          maxWidth: sidebarOpen ? 400 : 64,
        }}
      >
        {/* Header: Toggle button and logo side by side in expanded, vertical in mini */}
        <div
          className={cn(
            "sticky top-0 z-20",
            sidebarOpen
              ? "flex flex-row items-center justify-between pt-4 pb-4 px-4"
              : "flex flex-col items-center justify-center pt-4 pb-2 px-0"
          )}
        >
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
          <div
            className={cn(
              "transition-all px-4 flex flex-col justify-between h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
            )}
          >
            <div className="flex flex-col gap-4 pb-4">
              {/* Search Bar and New Session Button */}
              <div className="flex flex-col gap-2 sticky top-0 z-10 bg-surface/95 backdrop-blur-sm pb-4">
                <Button
                  variant="ghost"
                  onClick={handleCreateSession}
                  title="Create new session"
                  className="bg-secondary flex justify-start text-sm h-[40px] "
                >
                  <Plus size={18} />
                  <span>New Chat</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleCreateSession}
                  title="Global search"
                  className="bg-secondary flex justify-start text-sm h-[40px] "
                >
                  <Search size={18} className="text-primary" />
                  <span>Global Search</span>
                </Button>
              </div>

              {/* Mode Selector */}
              <div className="pb-4">
                <ModeSelector
                  currentMode={chatMode}
                  onModeChange={handleModeChange}
                />
              </div>

              {/* Chat Sessions */}
              <div className="flex-1 space-y-4">
                {loading.fetch
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-accent/30 animate-pulse mb-2 border border-border/50 shadow-sm"
                      >
                        <div className="flex justify-between items-center">
                          <span className="h-4 bg-muted-foreground/20 rounded w-3/4"></span>
                          <div className="w-5 h-5 bg-muted-foreground/20 rounded-full"></div>
                        </div>
                      </div>
                    ))
                  : sessions
                      .filter((section) =>
                        section.items.some((session) =>
                          session.title
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                      )
                      .map((section, index) => (
                        <div
                          key={index}
                          className="animate-in fade-in slide-in-from-left-2"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <h2 className="mb-2 text-foreground text-xs font-medium uppercase tracking-wider px-3 flex items-center gap-2">
                            <div className="w-[3px] h-4 bg-primary rounded-full"></div>
                            {section.section}
                          </h2>
                          {section.items
                            .filter((session) =>
                              session.title
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                            )
                            .map((session, i) => (
                              <div
                                key={i}
                                onClick={() => onChatSelect(session)}
                                className={cn(
                                  "group p-3 py-2 rounded-xl cursor-pointer text-sm flex justify-between items-center transition-all duration-200 active:scale-[0.98]",
                                  String(sessionId) == String(session._id)
                                    ? "bg-primary/10 text-primary border border-primary/30 shadow-md hover:shadow-lg"
                                    : "hover:bg-secondary hover:shadow-sm"
                                )}
                              >
                                {renaming === session._id ? (
                                  <input
                                    autoFocus
                                    defaultValue={session.title}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        onRename(
                                          session._id,
                                          (e.target as HTMLInputElement).value
                                        );
                                      }
                                    }}
                                    onBlur={(e) =>
                                      onRename(
                                        session._id,
                                        (e.target as HTMLInputElement).value
                                      )
                                    }
                                    className={cn(
                                      "w-full bg-background border border-border px-3 py-1.5 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all",
                                      loading.rename
                                        ? "animate-pulse cursor-not-allowed opacity-50"
                                        : ""
                                    )}
                                    disabled={loading.rename}
                                  />
                                ) : (
                                  <>
                                    <span className="text-muted-foreground truncate font-medium group-hover:text-primary transition-colors">
                                      {session.title}
                                    </span>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="w-7 h-7 hover:bg-accent/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <MoreVertical className="w-3.5 h-3.5" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="w-40"
                                      >
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setRenaming(session._id);
                                          }}
                                          className="cursor-pointer"
                                        >
                                          Rename
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSessionToDelete(session);
                                            setOpenDeleteModal(true);
                                          }}
                                          className="cursor-pointer text-destructive focus:text-destructive"
                                        >
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </>
                                )}
                              </div>
                            ))}
                        </div>
                      ))}
              </div>
            </div>

            <div className="mt-auto pt-2 sticky bottom-0 pb-2 bg-surface/95 backdrop-blur-sm">
              <div className="px-4 py-3 flex items-center gap-3 hover:bg-accent/50 cursor-pointer rounded-lg transition-all duration-200 hover:shadow-sm group">
                <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:rotate-45 duration-300" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  Settings
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Mini sidebar: logo and icons in vertical orientation
          <div
            className={cn(
              "transition-all flex flex-col items-center justify-between h-full pb-4 overflow-y-auto"
            )}
          >
            <div className="flex flex-col items-center gap-2 flex-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCreateSession}
                title="Global search"
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCreateSession}
                title="Create new session"
              >
                <Plus className="w-4 h-4" />
              </Button>

              {/* Mode Selector - Collapsed */}
              <div className="pt-4 border-t border-border/50 mt-2 w-full flex flex-col items-center">
                <ModeSelector
                  currentMode={chatMode}
                  onModeChange={handleModeChange}
                  collapsed
                />
              </div>
            </div>
            <div className="mb-2">
              <Button
                size="icon"
                variant="ghost"
                title="Settings"
                className="hover:scale-110 transition-all duration-300 hover:bg-accent/50 w-11 h-11"
              >
                <Settings className="w-4 h-4 hover:rotate-45 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile overlay aside */}
      <aside
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-40 bg-surface border-r border-border w-[85%] max-w-[20rem] transform transition-transform duration-300 ease-in-out shadow-2xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header: Toggle button and logo */}
        <div className="flex flex-row items-center justify-between pt-4 pb-3 h-[64px] border-b border-border px-4 bg-surface/95 backdrop-blur-sm sticky top-0 z-20">
          <Button
            size="icon"
            variant="ghost"
            className="transition-transform hover:scale-110 duration-200 z-40 rounded-full"
            onClick={() => updateSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="transition-transform hover:scale-110 duration-200">
            <Logo size="sm" type="mini_green" />
          </div>
        </div>

        {/* Body (reuse main content) */}
        <div className="flex flex-col justify-between h-[calc(100vh-64px)] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <div className="flex flex-col gap-4 p-4">
            {/* Search and New session */}
            <div className="flex flex-col gap-2 sticky top-0 bg-surface/95 backdrop-blur-sm z-10 pb-3">
              <Input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 hover:border-primary/50"
              />
              <Button
                size="sm"
                variant="default"
                onClick={handleCreateSession}
                title="Create new session"
                className="w-full justify-start gap-2 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </Button>
            </div>

            {/* Mode Selector - Mobile */}
            <div className="pb-2">
              <ModeSelector
                currentMode={chatMode}
                onModeChange={handleModeChange}
              />
            </div>

            {/* Sessions list (simplified reuse) */}
            <div className="flex-1 space-y-4">
              {sessions
                .filter((section) =>
                  section.items.some((session) =>
                    session.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                )
                .map((section, index) => (
                  <div
                    key={index}
                    className="space-y-2 animate-in fade-in slide-in-from-left-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <h2 className="text-muted-foreground text-xs font-semibold mb-2 uppercase tracking-wide flex items-center gap-2 px-2">
                      <div className="w-1 h-3 bg-primary rounded-full"></div>
                      {section.section}
                    </h2>
                    {section.items
                      .filter((session) =>
                        session.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((session, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            onChatSelect(session);
                            updateSidebarOpen(false);
                          }}
                          className={cn(
                            "p-3 rounded-lg cursor-pointer text-sm flex justify-between items-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                            String(sessionId) == String(session._id)
                              ? "bg-primary/10 text-primary border border-primary/20 shadow-md"
                              : "bg-transparent hover:bg-accent/50 hover:border-border/50 hover:shadow-sm border border-transparent"
                          )}
                        >
                          <span className="truncate font-medium">
                            {session.title}
                          </span>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ChatbotSidebar;
