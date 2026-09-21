export type MediaPermissionStatus =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "unsupported"
  | "error";

export interface RemotePeerMedia {
  userId: string;
  displayName: string;
  stream: MediaStream;
  hasVideo: boolean;
  hasAudio: boolean;
  connectionState: RTCPeerConnectionState;
}

export interface WebRTCState {
  isSupported: boolean;
  permissionStatus: MediaPermissionStatus;
  isCameraOn: boolean;
  isMicOn: boolean;
  localStream: MediaStream | null;
  remotePeers: RemotePeerMedia[];
  error: string | null;
}
