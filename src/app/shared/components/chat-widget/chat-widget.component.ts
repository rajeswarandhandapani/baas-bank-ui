import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
export class ChatWidgetComponent implements AfterViewInit, OnDestroy {
  constructor(private auth: AuthService, private chat: ChatService) {}

  open = false;
  draft = '';
  messages$: Observable<ChatMessage[]> = this.chat.messages$;
  isLoading$ = this.chat.isLoading$;

  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;
  private messagesSub?: any;

  ngAfterViewInit(): void {
    // Scroll to bottom whenever messages change
    this.messagesSub = this.messages$.subscribe(() => this.scrollToBottom());
  }

  ngOnDestroy(): void {
    if (this.messagesSub?.unsubscribe) {
      this.messagesSub.unsubscribe();
    }
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  toggle() {
    this.open = !this.open;
    if (this.open) {
      this.scrollToBottom();
    }
  }

  send() {
    const text = this.draft.trim();
    if (!text) return;
    this.chat.send(text);
    this.draft = '';
    this.scrollToBottom();
  }

  private scrollToBottom() {
    // Defer to next tick to ensure DOM has rendered new messages
    setTimeout(() => {
      const el = this.scrollContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 0);
  }
}
