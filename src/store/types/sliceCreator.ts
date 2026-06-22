import type {DashboardStore} from './dashboardStore';

export type SliceCreator<T> = (
  set: (
    partial: Partial<DashboardStore> | ((state: DashboardStore) => Partial<DashboardStore>),
    replace?: false,
  ) => void,
  get: () => DashboardStore,
) => T;
