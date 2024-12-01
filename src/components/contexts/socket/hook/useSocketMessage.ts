"use client";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

interface UseSocketMessageReturn {
  lastMessage: { type: string; payload: unknown } | null;
  sendMessage: (type: string, payload: unknown, room?: string) => void;
  isOnline: boolean;
  guestId: string | null;
}

export const useSocketMessage = (): UseSocketMessageReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lastMessage, setLastMessage] = useState<{ type: string; payload: unknown } | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [guestId, setGuestId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('guestId');
    }
    return null;
  });
  const pendingMessagesRef = useRef<{ type: string; payload: unknown; room?: string }[]>([]);

  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    console.log("session ->", session);
    const newSocket = io(SOCKET_URL, {
      reconnectionDelay: 1000,
      auth: {
        userId: session?.user?.id ?? guestId,
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      setSocket(newSocket);
      setIsOnline(true);
      
      // Send any pending messages once connected
      console.log("pendingMessages.length ->", pendingMessagesRef.current.length);
      pendingMessagesRef.current.forEach(({ type, payload, room }) => {
        console.log("Sending pending message ->", type, payload, room);
        if (room) {
          newSocket.emit('room_message', { room, type, payload });
        } else {
          newSocket.emit(type, payload);
        }
      });
      pendingMessagesRef.current = [];
    });

    newSocket.on("guest_id_assigned", (id) => {
      console.log("Guest ID:", id);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('guestId', id);
      }
      setGuestId(id);
    });

    newSocket.onAny((type, payload) => {
      console.log("Received message:", { type, payload });
      setLastMessage({ type, payload });
    });

    newSocket.on("redirect", (url) => {
      router.push(url);
    });
    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setIsOnline(false);
    });


    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      toast.error("Lost connection to server");
    } else {
      toast.success("Back Online");
    }
  }, [isOnline]);

  const sendMessage = (type: string, payload: unknown, room?: string) => {
    if (socket) {
      console.log("Sending message ->", type, payload, room);
      if (room) {
        socket.emit('room_message', { room, type, payload });
      } else {
        socket.emit(type, payload);
      }
    } else {
      console.log("Socket not connected, queueing message ->", type, payload, room);
      pendingMessagesRef.current = [...pendingMessagesRef.current, { type, payload, room }];
    }
  };

  return {
    lastMessage,
    sendMessage,
    isOnline,
    guestId,
  };
};
