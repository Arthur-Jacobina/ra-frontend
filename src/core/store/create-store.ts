import { useSyncExternalStore } from 'react';

import type { IStore } from './base-store';
import { Store } from './store';

type UseStoreHook<T> = () => [T | null | undefined, IStore.StateSetter<T>];

export function createStore<T>(initialValue: IStore.Initializer<T>): [IStore<T>, UseStoreHook<T>] {
  const store = new Store(initialValue);
  const useHook: UseStoreHook<T> = () => useStore(store);
  return [store, useHook];
}

export function useStore<T>(store: IStore<T>): [T | null | undefined, IStore.StateSetter<T>] {
  const state = useSyncExternalStore(store.subscribe, store.getState);
  return [state, store.setState];
}
