import { Trigger } from "@akashic/trigger";
import { PlayStore } from "./PlayStore";

export interface PlayTreeStoreParameterObject {
	playStore: PlayStore;
}

export class PlayTree {
	playId: string;
	children: PlayTree[] = [];

	constructor(playId: string) {
		this.playId = playId;
	}

	addChild(childId: string): void {
		const tree = new PlayTree(childId);
		this.children.push(tree);
	}

	removeChild(childId: string): void {
		this.children = this.children.filter(child => child.playId !== childId);
	}

	removeAllChildren(): void {
		this.children = [];
	}

	hasDescendant(childId: string): PlayTree | null {
		if (this.playId === childId) {
			return this;
		}
		return this.children.find(child => child.hasDescendant(childId) != null) || null;
	}
}

export class PlayTreeStore {
	onPlayTreeChange: Trigger<PlayTree[]> = new Trigger();

	private playTree: PlayTree[] = [];

	addPlay(playId: string): PlayTree {
		const tree = this._addPlay(playId);
		this.onPlayTreeChange.fire(this.playTree);
		return tree;
	}

	addChildToPlay(playId: string, childPlayId: string): void {
		this._addChildToPlay(playId, childPlayId);
		this.onPlayTreeChange.fire(this.playTree);
	}

	removeChild(playId: string, childPlayId: string): void {
		this._removeChild(playId, childPlayId);
		this.onPlayTreeChange.fire(this.playTree);
	}

	removeAllChildren(playId: string): void {
		this._removeAllChildren(playId);
		this.onPlayTreeChange.fire(this.playTree);
	}

	removePlay(playId: string): void {
		this._removePlay(playId);
		this.onPlayTreeChange.fire(this.playTree);
	}

	getPlayTree(): PlayTree[] {
		return this.playTree;
	}

	private _removeChild(playId: string, childPlayId: string): void {
		if (playId === childPlayId) {
			throw new Error("playId equals childPlayId");
		}
		let parent: PlayTree;
		for (let i = 0; i < this.playTree.length; i++) {
			parent = this.playTree[i].hasDescendant(playId);
			if (parent) {
				break;
			}
		}
		if (parent == null) {
			throw new Error("parent not found");
		}
		parent.removeChild(childPlayId);

		if (parent.children.length <= 0) {
			this._removePlay(playId);
		}
	}

	private _removePlay(playId: string): void {
		for (let i = 0; i < this.playTree.length; i++) {
			this.playTree[i].removeChild(playId);
		}
		this.playTree = this.playTree.filter(tree => tree.playId !== playId);
	}

	private _removeAllChildren(playId: string): void {
		let parent: PlayTree;
		for (let i = 0; i < this.playTree.length; i++) {
			parent = this.playTree[i].hasDescendant(playId);
			if (parent) {
				break;
			}
		}
		if (parent != null) {
			parent.removeAllChildren();
			this._removePlay(playId);
		}
	}

	private _addPlay(playId: string): PlayTree {
		const tree = new PlayTree(playId);
		this.playTree.push(tree);
		return tree;
	}

	private _addChildToPlay(playId: string, childPlayId: string): void {
		if (playId === childPlayId) {
			throw new Error("playId equals childPlayId");
		}
		let parent: PlayTree;
		for (let i = 0; i < this.playTree.length; i++) {
			parent = this.playTree[i].hasDescendant(playId);
			if (parent) {
				break;
			}
		}
		if (parent == null) {
			parent = this._addPlay(playId);
		}

		parent.addChild(childPlayId);
		this.playTree = this.playTree.filter(tree => tree.playId !== childPlayId);
	}
}
