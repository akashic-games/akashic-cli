import { createSocketInstance } from "./createSocketInstance";

const wsProtocol = window.location.protocol.includes("https") ? "wss" : "ws";

export const socketInstance = createSocketInstance(`${wsProtocol}://${window.location.host}`);
