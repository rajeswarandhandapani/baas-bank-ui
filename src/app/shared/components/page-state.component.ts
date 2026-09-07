import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
@Component({
  selector: 'app-page-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (loading()) {
      <div class="state" role="status">
        <span class="loader"></span> Loading your latest information…
      </div>
    } @else if (error()) {
      <div class="state error-state" role="alert">
        <strong>We couldn’t load this information.</strong>
        <p>Check your connection and try again.</p>
        <button class="button secondary" (click)="retry.emit()">
          Try again
        </button>
      </div>
    }`,
})
export class PageStateComponent {
  readonly loading = input(false);
  readonly error = input<unknown>();
  readonly retry = output<void>();
}
