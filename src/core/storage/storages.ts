import { hasWindow } from '../browser';

import { FakeStorage } from './fake.storage';
import type { Storage } from './storage.model';

enum StorageType {
  Local = 'localStorage',
}

export const Storages = {
  local: getStorage(StorageType.Local),
};

function getStorage(type: StorageType): Storage {
  const storage = getWindowStorage(type);
  return makeStorage(storage);
}

function getWindowStorage(type: StorageType) {
  if (!hasWindow() || !window[type]) {
    return new FakeStorage();
  }
  return window[type];
}

function makeStorage(storage: any): Storage {
  return {
    get<T>(key: string): T | null {
      try {
        return JSON.parse(storage.getItem(key));
      } catch {
        return null;
      }
    },

    put<T>(key: string, value: T) {
      const data = JSON.stringify(value);
      storage.setItem(key, data);
    },

    remove(key: string) {
      storage.removeItem(key);
    },
  };
}
