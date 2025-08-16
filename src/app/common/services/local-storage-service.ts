import { Injectable } from '@angular/core';
import { version } from '../../../../package.json';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
    const currentVersion = this.getItem<string>('version');
    if (currentVersion !== version) {
      this.clear();
      this.setItem<string>('version', version);
    }
  }

  setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, this.serialize(value));
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? this.deserialize<T>(item) : null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  private serialize(value: unknown): string {
    return JSON.stringify(value, this.replacer);
  }

  private deserialize<T>(text: string): T {
    return JSON.parse(text, this.reviver) as T;
  }

  private readonly replacer = (_key: string, value: any) => {
    if (value instanceof Map) {
      return { __type: 'Map', value: Array.from(value.entries()) };
    }
    if (value instanceof Set) {
      return { __type: 'Set', value: Array.from(value.values()) };
    }

    return value;
  };

  private readonly reviver = (_key: string, value: any) => {
    if (value && typeof value === 'object' && '__type' in value) {
      switch (value.__type) {
        case 'Map': {
          return new Map(value.value);
        }
        case 'Set': {
          return new Set(value.value);
        }
        default:
          return value;
      }
    }
    return value;
  };
}
