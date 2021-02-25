import * as queryString from "query-string";
import { Trigger } from "@akashic/trigger";

class Waiter<T> {
  promise: Promise<T>;
  resolve: (arg: T) => void;
  reject: (err: any) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export const onPaneAdd = new Trigger<string>();
export const onPaneRemove = new Trigger<string>();

let waitersGetPanes: Waiter<string[]>[] = [];

window.addEventListener("message", (ev) => {
  if (ev.source !== window.parent || ev.origin !== window.location.origin)
    return;
  switch (ev.data?.type) {
  case "response:getPanes":
    console.log("resgetpane");
    waitersGetPanes.forEach(waiter => waiter.resolve(ev.data.arg));
    waitersGetPanes = [];
    break;
  case "paneAdd":
    console.log("rev:add", ev.data.arg);
    onPaneAdd.fire(ev.data.arg);
    break;
  case "paneRemove":
    onPaneRemove.fire(ev.data.arg);
    break;
  default:
    console.error("unknown message:", ev.data);
  }
});

const query = queryString.parse(window.location.search);
const selfPaneKey = (query.paneKey as string) || null;

function post<T extends { type: string }>(arg: T): void {
  window.parent.postMessage({ paneKey: selfPaneKey, ...arg }, window.location.origin);
}

export function getPanes(): Promise<string[]> {
  const waiter = new Waiter<string[]>();
  waitersGetPanes.push(waiter);
  console.log("reqgetpane");
  post({ type: "request:getPanes" });
  return waiter.promise;
}

export function notifyPlayerId(playerId: string) {
  post({ type: "notifyPlayerId", playerId });
}

export function requestCloseThisFrame() {
  post({ type: "close" });
}