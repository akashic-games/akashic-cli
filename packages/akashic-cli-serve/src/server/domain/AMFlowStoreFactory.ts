import { AMFlowStore, MemoryAMFlowStore } from "@akashic/headless-driver/lib/play/amflow/AMFlowStore";

export const AMFlowStoreFactory = (playId: string): AMFlowStore => {
	const store = new MemoryAMFlowStore(playId);
    AMFlowStoreList[playId] = store;
    return store;
};

export const AMFlowStoreList: {[key: string]: AMFlowStore} = {};
