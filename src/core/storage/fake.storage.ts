export class FakeStorage {
  private storage: { [key: string]: string } = {};

  getItem(key: string): string | null {
    return this.storage[key];
  }

  setItem(key: string, data: string): void {
    this.storage[key] = data;
  }
}
