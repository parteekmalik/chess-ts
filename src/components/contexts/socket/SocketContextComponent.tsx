import React, { PropsWithChildren, useContext } from "react";
import SocketContext, { SocketContextProvider } from "./SocketContext";
import { useSocketMessage } from "./hook/useSocketMessage";

const SocketContextComponent: React.FunctionComponent<PropsWithChildren> = (props) => {
  const { children } = props;
  const { lastMessage, sendMessage, guestId } = useSocketMessage();

  return <SocketContextProvider value={{ lastMessage, sendMessage, guestId }}>{children}</SocketContextProvider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  return context;
};

export default SocketContextComponent;
