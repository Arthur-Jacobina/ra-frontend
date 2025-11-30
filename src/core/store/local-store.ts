import { Storages } from '../storage';

import { BaseStore, IStore } from './base-store';

export class LocalStore<T> extends BaseStore implements Omit<IStore<T>, 'getState' | 'setState'> {
  constructor(private readonly localStorageKey: string) {
    super();
  }

  setState = (stateOrFn: T | null | undefined | IStore.ISetter<T | null | undefined>): void => {
    if (IStore.isSetter(stateOrFn)) {
      this.state = stateOrFn(this.state);
    } else {
      this.state = stateOrFn;
    }
    Storages.local.put(this.localStorageKey, this.state);
    this.publish();
  };

  getState = (): T | null | undefined => {
    if (this.state === undefined) {
      this.state = Storages.local.get(this.localStorageKey);
    }
    return this.state;
  };

  refreshState = (): void => {
    this.state = Storages.local.get(this.localStorageKey);
    this.publish();
  };

  remove = (): void => {
    if (Storages.local.get(this.localStorageKey)) {
      this.state = null;
      Storages.local.remove(this.localStorageKey);
      this.publish();
    }
  };

  private state: T | null | undefined;
}
