import { action, observable } from "mobx";
import * as RootFrameApi from "../api/RootFrameApi";

export class FramePaneStore {
  @observable panes: string[] = [];

  private _initializationWaiter: Promise<void>;

  constructor() {
    RootFrameApi.onPaneAdd.add(this._addPane);
    RootFrameApi.onPaneRemove.add(this._removePane);

    this._initializationWaiter = RootFrameApi.getPanes().then((panes) => {
      console.log("getpane", panes);
      this.panes = panes;
    });
  }

  assertInitialized(): Promise<void> {
    return this._initializationWaiter;
  }

  @action.bound
  private _addPane(paneKey: string) {
    this.panes.push(paneKey);
    console.log("addp", paneKey, this.panes.length);
  }

  @action.bound
  private _removePane(paneKey: string) {
    this.panes = this.panes.filter(k => k !== paneKey);
  }
}