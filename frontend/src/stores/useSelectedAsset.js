import { create } from "zustand";

export const useSelectedAsset = create((set)=>({
    selectedAsset : "SOLUSDT",
    setSelectedAsset : (asset)=>set({selectedAsset:asset})
}))