import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ChatRoom } from "@/store/types/api";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentRoom } from "@/store/reducers/chatSlice";
import { useSocketContext } from "@/context/useSocketContext";
import toast from "react-hot-toast";
import Image from "next/image";

interface ConversationListProps {
  searchQuery: string;
}

const ConversationList: React.FC<ConversationListProps> = ({ searchQuery }) => {

  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const dispatch = useDispatch();
  const { rooms, currentRoom, roomStates, unreadCounts } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const { defaultSocket, reconnect } = useSocketContext();

  //////////////////////////////////////////////// STATES /////////////////////////////////////////////////

  //////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleSelectConversation = async (room: ChatRoom) => {
    if (!defaultSocket.socket) {
      // Try to reconnect socket using the context's reconnect function
      console.log('Socket not available, attempting to reconnect...');
      const reconnected = await reconnect();

      if (reconnected) {
        dispatch(setCurrentRoom(room));
      } else {
        toast.error("Unable to connect to chat server. Please refresh the page.");
      }
      return;
    }

    dispatch(setCurrentRoom(room));
  };

  // Filter conversations based on search query
  const filteredRooms = rooms.filter(room => {
    if (!searchQuery.trim()) return true;

    const lawyer = room?.participants?.find((p) => p._id !== user?._id);
    const lawyerName = lawyer ? `${lawyer.firstname} ${lawyer.lastname}`.toLowerCase() : '';
    const lastMessage = room.lastMessage?.content?.toLowerCase() || '';

    return lawyerName.includes(searchQuery.toLowerCase()) ||
      lastMessage.includes(searchQuery.toLowerCase());
  });

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  if (filteredRooms.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center h-full min-h-0">
        <div className="flex flex-col items-center justify-center" >
          <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
          <p className="text-gray-500">
            {searchQuery ? "Try a different search term" : "Start a new conversation to get started"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full min-h-0 flex-1 space-y-1">
      {filteredRooms.map((room, index) => {
        const isSelected = currentRoom?._id === room._id;
        const lawyer = room?.participants?.find((p) => p._id !== user?._id);
        const currentRoomState = roomStates[room._id];
        const onlineUsers = currentRoomState?.onlineUsers || [];
        const isOtherUserOnline = lawyer ? onlineUsers.includes(lawyer._id) : false;
        const unreadCount = unreadCounts[room._id] || 0;

        return (
          <div
            key={index}
            className={`relative group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 shadow-sm
              ${isSelected ? 'bg-surface ' : 'bg-transparent hover:bg-accent/60 border border-transparent'}
            `}
            style={{ minHeight: 72 }}
            onClick={() => handleSelectConversation(room)}
            tabIndex={0}
            aria-selected={isSelected}
          >
            {/* Vertical accent bar for selected */}
            <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-full transition-all duration-200 ${isSelected ? 'bg-primary' : 'bg-transparent'}`} />
            {/* Avatar and status */}
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center overflow-hidden border !border-border shadow">
                {lawyer?.profilePicture ? (
                  <Image
                    src={lawyer.profilePicture}
                    alt={lawyer.firstname + " " + lawyer.lastname}
                    fill
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-base font-bold text-muted-foreground">
                    {lawyer?.firstname.split(' ').map(name => name[0]).join('').toUpperCase()}
                  </span>
                )}
              </div>
              {isOtherUserOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow" />
              )}
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow">
                  <span className="text-xs font-bold text-primary-foreground">
                    {unreadCount}
                  </span>
                </div>
              )}
            </div>
            {/* Main info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h4 className={`capitalize font-semibold text-base truncate ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary transition-colors'}`}>
                  {lawyer?.firstname + " " + lawyer?.lastname}
                </h4>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {formatDistanceToNow(new Date(room.lastMessageAt!), { addSuffix: true })}
                </span>
              </div>
              <p className={`text-sm truncate text-muted-foreground ${isSelected && 'group-hover:text-foreground transition-colors'}`}>
                {room.lastMessage?.content || 'No messages yet'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
