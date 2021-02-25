import * as queryString from "query-string";
import { Trigger } from "@akashic/trigger";

export interface RootFrameApiHostHandlers {
  getPanes: () => string[];
}

let handlers: RootFrameApiHostHandlers = null!;
export function setHandlers(hs: RootFrameApiHostHandlers): void {
  handlers = hs;
}

export const onRequestPaneClose = new Trigger<string>();

/*
window.addEventListener("message", (ev) => {
  if (ev.source !== window.parent || ev.origin !== window.location.origin)
    return;
  switch (ev.data?.type) {
  case "response:getPanes":
    waitersGetPanes.forEach(waiter => waiter.resolve(ev.data.arg));
    waitersGetPanes = [];
    break;
  case "paneAdd":
    onPaneAdd.fire(ev.data.arg);
    break;
  case "paneRemove":
    onPaneRemove.fire(ev.data.arg);
    break;
  default:
    console.error("unknown message:", ev.data);
  }
});
*/

export let paneTable: { paneKey: string, playerId: string, window: MessageEventSource }[] = [];

function post(paneKey: string, data: any): void {
  console.log("POST", paneKey, data, paneTable);
  paneTable.filter(e => e.paneKey === paneKey).forEach(e => {
    console.log("POST", e.paneKey, data);
    (e.window.postMessage as any)(data);
  });
}

function broadcast(data: any): void {
  paneTable.forEach(e => (e.window.postMessage as any)(data));
}

window.addEventListener("message", ev => {
  if (ev.origin !== window.location.origin)
    return;
  switch (ev.data?.type) {
  case "notifyPlayerId":
    console.log("GETNOTIFYPID", ev.data);
    if (paneTable.filter(e => e.paneKey === ev.data.paneKey).length > 0) {
      return;
    }
    paneTable.push({
      paneKey: ev.data.paneKey,
      playerId: ev.data.playerId,
      window: ev.source
    })
    break;
  case "request:getPanes":
    if (paneTable.filter(e => e.paneKey === ev.data.paneKey).length === 0) {
      paneTable.push({ paneKey: ev.data.paneKey, playerId: null, window: ev.source });
    }
    console.log("recvrecgetpane", ev.data.paneKey);
    post(ev.data.paneKey, { type: "response:getPanes", arg: handlers.getPanes() });
    break;
  case "close":
    onRequestPaneClose.fire(ev.data.paneKey);
    break;
  }
});

export function notifyBroadcastPaneAdd(paneKey: string): void {
  broadcast({ type: "paneAdd", arg: paneKey });
  console.log("br:add", paneKey);
}

export function notifyBroadcastPaneRemove(paneKey: string): void {
  paneTable = paneTable.filter(e => e.paneKey !== paneKey);
  broadcast({ type: "paneRemove", arg: paneKey });
}
