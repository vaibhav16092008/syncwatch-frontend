import { io, Socket } from "socket.io-client";
import { SocketConnectionState } from "@/types/socket";

const DEFAULT_SOCKET_URL = "http://localhost:5000";

const getSocketUrl = (): string => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }
  return process.env.NEXT_PUBLIC_SOCKET_URL || DEFAULT_SOCKET_URL;
};

class SocketManager {
  private socket: Socket | null = null;
  private state: SocketConnectionState = "disconnected";
  private stateListeners: Set<(state: SocketConnectionState) => void> = new Set();

  /**
   * Returns current Socket instance if initialized
   */
  public getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Returns current connection state
   */
  public getState(): SocketConnectionState {
    return this.state;
  }

  /**
   * Subscribe to connection state changes
   */
  public onStateChange(listener: (state: SocketConnectionState) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.state);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  private updateState(newState: SocketConnectionState) {
    this.state = newState;
    this.stateListeners.forEach((listener) => listener(newState));
  }

  /**
   * Initializes and connects Socket.IO client lazily.
   * Guarantees single socket instance and prevents duplicate connections.
   */
  public connect(): Socket {
    if (this.socket && (this.socket.connected || this.socket.active)) {
      return this.socket;
    }

    if (!this.socket) {
      const url = getSocketUrl();
      this.socket = io(url, {
        transports: ["websocket", "polling"],
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      this.socket.on("connect", () => {
        this.updateState("connected");
      });

      this.socket.on("disconnect", () => {
        this.updateState("disconnected");
      });

      this.socket.on("connect_error", () => {
        this.updateState("error");
      });
    }

    this.updateState("connecting");
    this.socket.connect();
    return this.socket;
  }

  /**
   * Cleanly disconnects and removes socket instance
   */
  public disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.updateState("disconnected");
  }
}

export const socketManager = new SocketManager();
