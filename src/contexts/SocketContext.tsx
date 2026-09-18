"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { socketManager } from "@/lib/socket/client";
import { SocketConnectionState } from "@/types/socket";

export interface SocketContextType {
  socket: Socket | null;
  connectionState: SocketConnectionState;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Socket;
  disconnect: () => void;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [connectionState, setConnectionState] = useState<SocketConnectionState>(socketManager.getState());
  const [socket, setSocket] = useState<Socket | null>(socketManager.getSocket());

  useEffect(() => {
    // Listen for socket manager connection state changes without auto-connecting
    const unsubscribe = socketManager.onStateChange((newState) => {
      setConnectionState(newState);
      setSocket(socketManager.getSocket());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Lazy connect trigger for feature modules (e.g., room join/connect in F3/F4)
  const connect = useCallback(() => {
    const instance = socketManager.connect();
    setSocket(instance);
    return instance;
  }, []);

  // Disconnect trigger
  const disconnect = useCallback(() => {
    socketManager.disconnect();
    setSocket(null);
  }, []);

  const value: SocketContextType = {
    socket,
    connectionState,
    isConnected: connectionState === "connected",
    isConnecting: connectionState === "connecting",
    connect,
    disconnect,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
