import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent {
  readonly auth = inject(AuthService);
  readonly error = signal('');
  login(onboard = false): void {
    this.auth
      .login(onboard)
      .catch(() =>
        this.error.set('Sign-in could not start. Please try again.'),
      );
  }
}
