import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService<T> {
  public pageSize = signal<number>(10);
  public pageIndex = signal<number>(0);
  public pageOffset = computed<number>(
    () => this.pageIndex() * this.pageSize()
  );
  public keepAliveData = signal(false);
  public storage: Record<string, T> = {};

  resetPagination() {
    this.pageSize.set(10);
    this.pageIndex.set(0);
    this.keepAliveData.set(false);
  }
}
