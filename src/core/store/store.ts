import { BaseStore, IStore } from './base-store';

export class Store<T> extends BaseStore implements IStore<T> {
  constructor(stateOrInitializer: IStore.Initializer<T>) {
    super();

    this.init = () => {
      if (this.initialized) {
        return;
      }
      this.initialized = true;
      if (typeof stateOrInitializer === 'function') {
        this.state = (stateOrInitializer as () => T)();
      } else {
        this.state = stateOrInitializer;
      }
    };
  }

  setState = (stateOrFn: T | null | undefined | IStore.ISetter<T | null | undefined>): void => {
    this.init();
    if (IStore.isSetter(stateOrFn)) {
      this.state = stateOrFn(this.state);
    } else {
      this.state = stateOrFn;
    }
    this.publish();
  };

  getState = (): T | null | undefined => {
    this.init();
    return this.state;
  };

  private state: T | null | undefined;
  private readonly init: () => void;
  private initialized = false;
}
