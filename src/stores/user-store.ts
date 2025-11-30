import { type IStore, LocalStore, useStore } from '@/core/store';
import type { User } from '@/model/user.model';
import { LocalStorageKeys } from './storage-constants';

const LOCAL_STORAGE_USER_KEY = LocalStorageKeys.User;

class UserStore extends LocalStore<User> implements IStore<User> {}

export const userStoreInstance = new UserStore(LOCAL_STORAGE_USER_KEY);

export const useUserStore = (): [User | null | undefined, IStore.StateSetter<User>] =>
  useStore<User>(userStoreInstance);
