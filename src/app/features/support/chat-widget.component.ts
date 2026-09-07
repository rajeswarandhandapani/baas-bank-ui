import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChatService } from './data-access/chat.service';
@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<section class="chat-panel" aria-label="Banking assistant">
    <header>
      <strong>Banking assistant</strong
      ><button (click)="open.set(!open())" [attr.aria-expanded]="open()">
        {{ open() ? 'Minimize' : 'Open' }}
      </button>
    </header>
    @if (open()) {
      <div class="chat-messages" aria-live="polite">
        @for (message of messages(); track $index) {
          <p [class.from-user]="message.sender === 'user'">
            {{ message.text }}
          </p>
        }
      </div>
      <form (ngSubmit)="send()">
        <label class="sr-only" for="chat-message">Message</label
        ><input
          id="chat-message"
          name="message"
          [(ngModel)]="draft"
          placeholder="Ask about your banking…"
        /><button class="button" [disabled]="loading() || !draft.trim()">
          {{ loading() ? '…' : 'Send' }}
        </button>
      </form>
    }
  </section>`,
})
export class ChatWidgetComponent {
  private readonly chat = inject(ChatService);
  readonly messages = toSignal(this.chat.messages$, { initialValue: [] });
  readonly loading = toSignal(this.chat.isLoading$, { initialValue: false });
  readonly open = signal(true);
  draft = '';
  send(): void {
    if (this.loading() || !this.draft.trim()) return;
    this.chat.send(this.draft.trim());
    this.draft = '';
  }
}
