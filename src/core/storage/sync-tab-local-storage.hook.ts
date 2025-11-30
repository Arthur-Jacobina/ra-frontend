import { useEffect } from 'react';

interface SyncTabLocalStorageParams {
  storageKey: string;
  onChange: VoidFunction;
}

export const useSyncTabLocalStorage = ({ storageKey, onChange }: SyncTabLocalStorageParams): void => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentional
  useEffect(() => {
    // tab storage sync
    function handleStorageEvent(event: StorageEvent) {
      if (event.key === storageKey || event.key === null) {
        // token was changed in another tab or local storage was cleared
        onChange();
      }
    }

    window?.addEventListener('storage', handleStorageEvent);

    return () => {
      window?.removeEventListener('storage', handleStorageEvent);
    };
  }, []);
};
