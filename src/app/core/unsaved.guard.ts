import { CanDeactivateFn } from '@angular/router';

export const unsavedGuard: CanDeactivateFn<any> = (component) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};