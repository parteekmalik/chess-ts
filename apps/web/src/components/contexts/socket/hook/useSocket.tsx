import type { ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import io from "socket.io-client";

import type {} from "@acme/lib/WStypes/typeForBackendAndSocket";

import type { BACKEND_SERVER_UPDATE_PAYLOAD, NOTIFICATION_PAYLOAD } from "@acme/lib/WStypes/typeForFrontendToSocket";
import { BACKEND_SERVER_UPDATE } from "@acme/lib/WStypes/typeForFrontendToSocket";

import { env } from "~/env";

export interface acknoledgementResponce {
  error?: unknown;
  data: unknown;
}

const useSocket = () => {
  // Use state to store the socket instance instead of a ref.
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [lastMessage, setLastMessage] = useState<{ type: string; payload: NOTIFICATION_PAYLOAD }>({
    type: "init",
    payload: null as unknown as NOTIFICATION_PAYLOAD,
  });
  const [backendServerConnection, setBackendServerConnection] = useState<BACKEND_SERVER_UPDATE_PAYLOAD>("disconneted");

  const { data: session } = useSession();

  useEffect(() => {
    // Only create the socket if it doesn't already exist.
    if (socketInstance || !session) return;

    const opts = {
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
      auth: {
        token: "sessionToken" in session && session.sessionToken,
      },
    } satisfies Partial<ManagerOptions & SocketOptions>;

    console.log("connecting to server", env.NEXT_PUBLIC_BACKEND_WS, {
      ...opts,
    });

    const newSocket = io(env.NEXT_PUBLIC_BACKEND_WS, opts);

    newSocket.on("connect", () => toast.success("Backend server is up. You can start matching"));

    newSocket.on("disconnect", () => toast.error("Backend server is getting up. It will take few minutes"));

    newSocket.on(BACKEND_SERVER_UPDATE, (msg: BACKEND_SERVER_UPDATE_PAYLOAD) => setBackendServerConnection(msg));

    newSocket.onAny((type: string, payload: NOTIFICATION_PAYLOAD) => {
      console.log("[RECIEVED]", type, payload);
      setLastMessage({ type, payload });
    });

    setSocketInstance(newSocket);
  }, [socketInstance, session]);

  const SocketEmiter = useCallback(
    <Ev extends string>(ev: Ev, ...args: unknown[]) => {
      if (!socketInstance?.connected) {
        toast.error("Backend server is getting up. It will take few minutes");
        return;
      }
      if (env.NODE_ENV === "development") {
        console.log("[EMIT]", ev, args);
      }
      args = args.map((arg) =>
        typeof arg === "function"
          ? (props: acknoledgementResponce) => {
              console.log("[ACKNOLEDGEMENT]", ev, args, props);
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              arg(props);
            }
          : arg,
      );
      return socketInstance.emit(ev, ...args);
    },
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [socketInstance, socketInstance?.connected],
  );

  return {
    // Return the send method from the stored socket instance.
    SocketEmiter: SocketEmiter,
    backendServerConnection,
    lastMessage,
  };
};

export default useSocket;
