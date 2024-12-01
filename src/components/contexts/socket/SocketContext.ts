import { createContext } from "react";

export interface ISocketContextState {
  lastMessage: { type: string; payload: unknown } | null;
  sendMessage: (type: string, payload: unknown, room?: string) => void;
  guestId: string | null;
}

export const defaultSocketContextState: ISocketContextState = {
  lastMessage: null,
  sendMessage: (type: string, payload: unknown, room?: string) => {
    console.log(type, payload, room);
  },
  guestId: null,
};

export interface ISocketContextProps {
  SocketState: ISocketContextState;
}

const SocketContext = createContext<ISocketContextState>({
  lastMessage: null,
  sendMessage: () => undefined,
  guestId: null,
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
