import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { ChatWidgetComponent } from './features/support/chat-widget.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatWidgetComponent],
  template: `<router-outlet />
    @if (auth.isAuthenticated()) {
      @defer (on interaction) {
        <app-chat-widget />
      } @placeholder {
        <button class="chat-launch" aria-label="Open banking assistant">
          Need a hand? ↗
        </button>
      }
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly auth = inject(AuthService);
}
