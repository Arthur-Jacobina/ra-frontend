export interface Storage {
  get<T>(key: string): T | null;
  put<T>(key: string, value: T): void;
  remove(key: string): void;
}
