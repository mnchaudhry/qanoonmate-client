"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from '@/store/store';
import { getMessages, getUserChatRooms } from '@/store/reducers/chatSlice';
import { useSocketContext } from '@/context/useSocketContext';
import MessagesHeader from "./_components/MessagesHeader";
import ConversationList from "./_components/ConversationList";
import ChatWindow from "./_components/ChatWindow";
import EmptyState from "./_components/EmptyState";
import { socketEvents } from "@/store/socket/events";

const MessagesPage = () => {

  //////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { currentRoom, rooms, messages } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const { defaultSocket } = useSocketContext();

  //////////////////////////////////////////////// STATES /////////////////////////////////////////////////
  const [searchQuery, setSearchQuery] = useState("");

  //////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////
  useEffect(() => {
    dispatch(getUserChatRooms());
  }, [dispatch]);

  // Load messages for all rooms, not just the selected one
  useEffect(() => {
    if (rooms.length > 0) {
      rooms.forEach(room => {
        if (!messages[room._id] || messages[room._id]?.length == 0)
          dispatch(getMessages(room._id));
      });
    }
  }, [rooms, dispatch, messages]);

  // Join all rooms for real-time updates
  useEffect(() => {
    if (rooms.length > 0 && defaultSocket.socket) {
      rooms.forEach(room => {
        socketEvents.chat.joinRoom(defaultSocket.socket, { roomId: room._id });
      });
    }
  }, [rooms, defaultSocket.socket]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (rooms.length > 0 && defaultSocket.socket) {
        rooms.forEach(room => {
          socketEvents.chat.leaveRoom(defaultSocket.socket, { roomId: room._id });
        });
      }
    };
  }, [rooms, defaultSocket.socket]);

  //////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////
  const handleSendMessage = (content: string) => {
    if (!currentRoom || !user?._id) return;

    socketEvents.chat.sendMessage(defaultSocket.socket, {
      roomId: currentRoom._id,
      content,
      type: 'TEXT',
    });
  };


  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="relative flex h-[calc(100vh-90px)] min-h-0 gap-3">

      {/* Sidebar */}
      <aside className="bg-muted/50 relative px-2.5 py-4 space-y-4 z-10 w-72 flex flex-col h-full min-h-0 rounded-lg border border-border overflow-hidden ">
        <div className="sticky top-0 z-20 rounded-b-xl">
          <MessagesHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          <ConversationList searchQuery={searchQuery} />
        </div>
      </aside>
      {/* Main Chat Area */}
      <main className="relative z-10 flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col min-h-0 rounded-lg bg-neutral/95 overflow-hidden">
          {currentRoom ? (
            <ChatWindow
              onSendMessage={handleSendMessage}
              onSendFile={() => { }}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </main>
    </div>
  );
};

export default MessagesPage;
