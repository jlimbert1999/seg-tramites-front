import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService<T> {
  private storage: Record<string, T> = {};

  public pageSize = signal<number>(10);
  public pageIndex = signal<number>(0);
  public pageOffset = computed<number>(
    () => this.pageIndex() * this.pageSize()
  );
  public keepAliveData = signal(false);

  resetPagination() {
    this.pageSize.set(10);
    this.pageIndex.set(0);
    this.keepAliveData.set(false);
  }

  save(key: string, data: T) {
    this.storage[key] = data;
  }

  load(key: string): T | undefined {
    return this.storage[key];
  }
}
