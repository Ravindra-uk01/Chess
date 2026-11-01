import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useUser } from '@repo/store/useUser';

const WS_URL = import.meta.env.VITE_APP_WEBSOCKET_URL || 'ws://localhost:8080';

interface SocketContextType {
  socket: WebSocket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const user = useUser();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user || !user.token) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        setSocket(null);
      }
      return;
    }

    // Reuse existing socket if open or connecting
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${user.token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Persistent WebSocket connection established');
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log('Persistent WebSocket connection closed');
      wsRef.current = null;
      setSocket(null);
    };

    ws.onerror = (err) => {
      console.error('Persistent WebSocket error:', err);
    };

    return () => {
      // Don't close on normal component re-renders; clean up if user logs out or provider unmounts
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        setSocket(null);
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  return context.socket;
};
