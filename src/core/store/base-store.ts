export class BaseStore {
  // designed to use with useSyncExternalStore
  subscribe = (listener: IStore.IListener): IStore.IUnsubscriber => {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  };

  protected publish = (): void => {
    this.listeners.forEach(listener => {
      listener();
    });
  };

  protected listeners: IStore.IListener[] = [];
}

export interface IStore<T> {
  setState: IStore.StateSetter<T>;
  subscribe: (listener: IStore.IListener) => IStore.IUnsubscriber;
  getState: () => T | null | undefined;
}

export namespace IStore {
  export type ISetter<T> = (val: T) => T;
  export type StateSetter<T> = (value: T | null | undefined | ISetter<T | null | undefined>) => void;
  export type Initializer<T> = (() => T) | T;
  export type IListener = () => void;
  export type IUnsubscriber = () => void;
  export function isSetter<T>(value: T | ISetter<T>): value is ISetter<T> {
    return typeof value === 'function';
  }
}
