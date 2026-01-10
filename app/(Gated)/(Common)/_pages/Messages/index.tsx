"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { getMessages, getUserChatRooms, sendFileMessage, setCurrentRoom } from "@/store/reducers/chatSlice";
import { useSocketContext } from "@/context/useSocketContext";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import MessagesHeader from "./_components/MessagesHeader";
import ConversationList from "./_components/ConversationList";
import ChatWindow from "./_components/ChatWindow";
import EmptyState from "./_components/EmptyState";
import { socketEvents } from "@/store/socket/events";
import toast from "react-hot-toast";

const MessagesPage = () => {
  //////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentRoom, rooms, messages } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const { defaultSocket } = useSocketContext();

  //////////////////////////////////////////////// STATES /////////////////////////////////////////////////
  const [searchQuery, setSearchQuery] = useState("");
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(320); // 320px = w-80
  const [isResizingLeft, setIsResizingLeft] = useState(false);

  // Width constraints
  const MIN_LEFT_WIDTH = 280;
  const MAX_LEFT_WIDTH = 480;

  //////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////
  useEffect(() => {
    dispatch(getUserChatRooms());
  }, [dispatch]);

  // Restore selected chat from URL query parameter
  useEffect(() => {
    const roomId = searchParams.get('roomId');
    const consultationId = searchParams.get('consultationId');

    if (rooms.length > 0) {
      // First priority: find by roomId
      if (roomId) {
        // Only set if it's different from current room
        if (!currentRoom || currentRoom._id !== roomId) {
          const room = rooms.find(r => r._id === roomId);
          if (room) {
            dispatch(setCurrentRoom(room));
          }
        }
        return;
      }

      // Second priority: find by consultationId
      if (consultationId) {
        const room = rooms.find(r => {
          const consultation = r.consultation;
          return typeof consultation === 'object' ? consultation._id === consultationId : consultation === consultationId;
        });
        if (room) {
          // Only set if it's different from current room
          if (!currentRoom || currentRoom._id !== room._id) {
            dispatch(setCurrentRoom(room));
            // Update URL to use roomId instead
            router.replace(`?roomId=${room._id}`, { scroll: false });
          }
        }
      }
    }
  }, [searchParams, rooms, currentRoom, dispatch, router]);

  // Load messages for all rooms, not just the selected one
  useEffect(() => {
    if (rooms.length > 0) {
      rooms.forEach((room) => {
        // Only fetch if messages don't exist yet
        if (!messages[room._id]) {
          dispatch(getMessages(room._id));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms, dispatch]);

  // Join all rooms for real-time updates
  useEffect(() => {
    if (rooms.length > 0 && defaultSocket.socket) {
      rooms.forEach((room) => {
        socketEvents.chat.joinRoom(defaultSocket.socket, { roomId: room._id });
      });
    }
  }, [rooms, defaultSocket.socket]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (rooms.length > 0 && defaultSocket.socket) {
        rooms.forEach((room) => {
          socketEvents.chat.leaveRoom(defaultSocket.socket, {
            roomId: room._id,
          });
        });
      }
    };
  }, [rooms, defaultSocket.socket]);

  const handleMouseDownLeft = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingLeft(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = e.clientX;
        if (newWidth >= MIN_LEFT_WIDTH && newWidth <= MAX_LEFT_WIDTH) {
          setLeftSidebarWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
    };

    if (isResizingLeft) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft]);

  //////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////
  const handleSendMessage = (content: string) => {
    if (!currentRoom || !user?._id) return;

    socketEvents.chat.sendMessage(defaultSocket.socket, {
      roomId: currentRoom._id,
      content,
      type: "TEXT",
    });
  };

  const handleSendFile = async (file: File) => {
    if (!currentRoom || !user?._id) {
      toast.error("Please select a chat room first");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes?.includes(file.type)) {
      toast.error("Invalid file type. Allowed: PDF, Images, Word, Excel");
      return;
    }

    try {
      // Dispatch the Redux action to upload file
      await dispatch(
        sendFileMessage({
          roomId: currentRoom._id,
          file,
        })
      ).unwrap();

      // Emit socket event for real-time update
      socketEvents.chat.sendMessage(defaultSocket.socket, {
        roomId: currentRoom._id,
        content: `Sent a file: ${file.name}`,
        type: "FILE",
      });
    } catch (error: any) {
      console.error("File upload error:", error);
      toast.error(error?.message || "Failed to upload file");
    }
  };

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className={cn("flex h-[calc(100vh-90px)] gap-4 bg-background", isResizingLeft && "select-none cursor-ew-resize")}>
      {/* Sidebar */}
      <aside
        style={{ width: `${leftSidebarWidth}px` }}
        className="flex flex-col bg-accent/30 border border-accent backdrop-blur-sm rounded-2xl overflow-hidden relative"
      >
        <MessagesHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="flex-1 min-h-0 overflow-y-auto">
          <ConversationList searchQuery={searchQuery} onRoomSelect={(roomId) => router.push(`?roomId=${roomId}`, { scroll: false })} />
        </div>

        {/* Resize Handle */}
        <div onMouseDown={handleMouseDownLeft} className="absolute top-0 right-0 w-1.5 h-full cursor-ew-resize hover:bg-primary/30 active:bg-primary/50 transition-colors group">
          <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-16 bg-border group-hover:bg-primary group-active:bg-primary transition-all rounded-full" />
        </div>

      </aside>
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-h-0">
        {currentRoom ? (
          <ChatWindow
            onSendMessage={handleSendMessage}
            onSendFile={handleSendFile}
          />
        ) : (
          <div className="flex-1 rounded-2xl overflow-hidden">
            <EmptyState />
          </div>
        )}
      </main>
    </div>
  );
};

export default MessagesPage;
