import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.component.html',
})
export class ChatWidgetComponent {
  constructor(private auth: AuthService, private chat: ChatService) {}

  open = false;
  draft = '';
  messages$: Observable<ChatMessage[]> = this.chat.messages$;
  isLoading$ = this.chat.isLoading$;

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  toggle() {
    this.open = !this.open;
  }

  send() {
    const text = this.draft.trim();
    if (!text) return;
    this.chat.send(text);
    this.draft = '';
  }
}
