import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toast$ = new Subject<{ message: string, type: 'success' | 'error' }>();

  success(message: string) {
    this.toast$.next({ message, type: 'success' });
  }

  error(message: string) {
    this.toast$.next({ message, type: 'error' });
  }
}