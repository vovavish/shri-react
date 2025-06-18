import { create } from 'zustand';
import { createReportSlice, type ReportSlice } from './ReportStore';

type StoreState = ReportSlice;

export const useStore = create<StoreState>((set, get, api) => ({
  ...createReportSlice(set, get, api),
}));
