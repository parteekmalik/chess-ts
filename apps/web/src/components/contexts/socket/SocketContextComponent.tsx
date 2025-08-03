import type { PropsWithChildren } from "react";
import React, { useContext } from "react";

import useSocket from "./hook/useSocket";
import SocketContext, { SocketContextProvider } from "./SocketContext";

const SocketContextComponent: React.FunctionComponent<PropsWithChildren> = (props) => {
  const { children } = props;
  const { SocketEmiter, backendServerConnection, lastMessage, addSocketListener } = useSocket();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return <SocketContextProvider value={{ SocketEmiter, backendServerConnection, lastMessage, addSocketListener }}>{children}</SocketContextProvider>;
};

export const useBackend = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  return context;
};

export default SocketContextComponent;
