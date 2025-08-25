"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { listenOnSocketEvents, socketEvents } from "@/store/socket/events";

interface SocketConnection {
  socket: Socket | null;
  isConnected: boolean;
  connectError: string | null;
  isAuthenticated: boolean;
  userId?: string;
}

interface SocketContextType {
  // Default namespace connection
  defaultSocket: SocketConnection;
  // Namespace-specific connections
  getSocket: (namespace?: string) => SocketConnection;
  // Connect to a specific namespace
  connectToNamespace: (namespace: string) => SocketConnection;
  // Disconnect from a namespace
  disconnectFromNamespace: (namespace: string) => void;
  // Get all active connections
  getAllConnections: () => Record<string, SocketConnection>;
  // Authenticate socket with user ID
  authenticateSocket: (userId: string, namespace?: string) => void;
  connectAgain: () => Promise<boolean>;
  // Reconnect to default socket
  reconnect: () => Promise<boolean>;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  /////////////////////////////////////////////// STATES /////////////////////////////////////////////////////
  const [connections, setConnections] = useState<
    Record<string, SocketConnection>
  >({
    "/": {
      socket: null,
      isConnected: false,
      connectError: null,
      isAuthenticated: false,
    },
  });

  /////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////
  // Define the socket server URL
  const socketUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  /////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////
  // Create socket connection for a specific namespace
  const createSocketConnection = (
    namespace: string = "/"
  ): SocketConnection => {
    const fullUrl = namespace === "/" ? socketUrl : `${socketUrl}${namespace}`;


    const socketInstance = io(fullUrl, {
      autoConnect: true,
      reconnection:true,
      reconnectionAttempts: 5,
      withCredentials: true,
      transports: ["websocket","polling"],
      reconnectionDelay: 2000,
      timeout: 60000,
    });

    const connection: SocketConnection = {
      socket: socketInstance,
      isConnected: false,
      connectError: null,
      isAuthenticated: false,
      userId: undefined,
    };

    // Set up event listeners
    socketInstance.on("connect", () => {

      setConnections((prev) => ({
        ...prev,
        [namespace]: {
          ...prev[namespace],
          isConnected: true,
          connectError: null,
        },
      }));
    });

    socketInstance.on("connect_error", (err) => {

      setConnections((prev) => ({
        ...prev,
        [namespace]: { ...prev[namespace], connectError: err.message },
      }));
    });

    socketInstance.on("disconnect", (reason) => {
      setConnections((prev) => ({
        ...prev,
        [namespace]: {
          ...prev[namespace],
          isConnected: false,
          isAuthenticated: false,
        },
      }));
    });

    socketInstance.on("error", (err) => {
      return;
    });

    // Authentication events
    socketInstance.on("auth:success", (data: any) => {

      setConnections((prev) => ({
        ...prev,
        [namespace]: {
          ...prev[namespace],
          isAuthenticated: true,
          userId: data.userId,
        },
      }));
    });

    socketInstance.on("auth:error", (data: any) => {

      setConnections((prev) => ({
        ...prev,
        [namespace]: {
          ...prev[namespace],
          isAuthenticated: false,
          userId: undefined,
        },
      }));
    });

    return connection;
  };

  // Connect to a specific namespace
  const connectToNamespace = (namespace: string): SocketConnection => {
    if (connections[namespace]?.socket) {
      return connections[namespace];
    }

    const connection = createSocketConnection(namespace);
    setConnections((prev) => ({ ...prev, [namespace]: connection }));

    return connection;
  };

  // Disconnect from a namespace
  const disconnectFromNamespace = (namespace: string) => {
    const connection = connections[namespace];
    if (connection?.socket) {
      connection.socket.disconnect();
      setConnections((prev) => {
        const newConnections = { ...prev };
        delete newConnections[namespace];
        return newConnections;
      });
    }
  };

  // Get socket for a specific namespace
  const getSocket = (namespace: string = "/"): SocketConnection => {
    if (!connections[namespace]) {
      // Auto-connect if not already connected
      return connectToNamespace(namespace);
    }
    return connections[namespace];
  };

  // Get all active connections
  const getAllConnections = (): Record<string, SocketConnection> => {
    return connections;
  };

  // Authenticate socket with user ID
  const authenticateSocket = (userId: string, namespace: string = "/") => {
    if (!userId) return;
    const connection = getSocket(namespace);
    if (connection.socket) {
      socketEvents.auth.authenticate(connection.socket, { userId });
    }
  };

  const connectAgain = async (): Promise<boolean> => {
    try {
      // if socket exists return
      const currentConnection = connections["/"];
      if (currentConnection?.socket) {
        return true;
      }

      const newConnection = createSocketConnection("/");
      setConnections((prev) => ({ ...prev, "/": newConnection }));

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error("Connection timeout")),
          5000
        );

        newConnection.socket!.on("connect", () => {
          clearTimeout(timeout);
          resolve(true);
        });

        newConnection.socket!.on("connect_error", (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });

      // Authenticate if user is available
      if (user?._id) {
        authenticateSocket(user._id, "/");
      }

      return true;
    } catch (error) {
      return false;
    }
  }


  // Reconnect to default socket
  const reconnect = async (): Promise<boolean> => {
    try {
      // Disconnect existing socket if connected
      const currentConnection = connections["/"];
      if (currentConnection?.socket) {
        currentConnection.socket.disconnect();
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for disconnect to complete
      }

      // Create new connection
      const newConnection = createSocketConnection("/");
      setConnections((prev) => ({ ...prev, "/": newConnection }));

      // Wait for connection to establish
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error("Connection timeout")),
          10000
        );

        newConnection.socket!.on("connect", () => {
          clearTimeout(timeout);
          resolve(true);
        });

        newConnection.socket!.on("connect_error", (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });

      // Authenticate if user is available
      if (user?._id) {
        authenticateSocket(user._id, "/");
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  /////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////////
  useEffect(() => {
    // Initialize default namespace connection
    connectToNamespace("/");

    // Clean up on unmount
    return () => {
      Object.keys(connections).forEach((namespace) => {
        disconnectFromNamespace(namespace);
      });
    };
  }, [user]);

  // Authenticate socket on mount
  useEffect(() => {
    const defaultSocket = connections["/"];
    if (
      user &&
      defaultSocket?.socket &&
      defaultSocket?.isConnected &&
      !defaultSocket?.isAuthenticated
    ) {
      authenticateSocket(user._id!, "/");
    }
  }, [user, connections, authenticateSocket]);

  // Register socket events when socket is available and connected
  useEffect(() => {
    const defaultSocket = connections["/"];
    if (
      defaultSocket?.socket &&
      defaultSocket?.isConnected &&
      defaultSocket?.isAuthenticated
    ) {
      const cleanup = listenOnSocketEvents(defaultSocket.socket, dispatch);
      return cleanup;
    }
  }, [connections, dispatch]);

  /////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////
  return (
    <SocketContext.Provider
      value={{
        defaultSocket: connections["/"] || {
          socket: null,
          isConnected: false,
          connectError: null,
          isAuthenticated: false,
        },
        getSocket,
        connectToNamespace,
        disconnectFromNamespace,
        getAllConnections,
        authenticateSocket,
        connectAgain,
        reconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

// Convenience hook for default namespace
export const useDefaultSocket = () => {
  const { defaultSocket } = useSocketContext();
  return defaultSocket;
};

// Convenience hook for specific namespace
export const useNamespaceSocket = (namespace: string) => {
  const { getSocket } = useSocketContext();
  return getSocket(namespace);
};

// Convenience hook for socket authentication
export const useSocketAuth = () => {
  const { authenticateSocket, defaultSocket } = useSocketContext();

  const authenticate = (userId: string, namespace?: string) => {
    authenticateSocket(userId, namespace);
  };

  return {
    authenticate,
    isConnected: defaultSocket?.isConnected,
    hasError: !!defaultSocket?.connectError,
  };
};
