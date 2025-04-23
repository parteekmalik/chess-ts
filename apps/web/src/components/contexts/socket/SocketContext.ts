import type { Socket } from "socket.io-client";
import { createContext } from "react";
import type { NOTIFICATION_PAYLOAD } from "@acme/lib/WStypes/typeForFrontendToSocket";

export interface ISocketContextState {
  SocketEmiter: Socket["emit"] | (() => void);
  backendServerConnection: "connected" | "disconneted";
  lastMessage: { type: string; payload: NOTIFICATION_PAYLOAD };
}

export interface ISocketContextProps {
  SocketState: ISocketContextState;
}

const SocketContext = createContext<ISocketContextState | undefined>(undefined);

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
