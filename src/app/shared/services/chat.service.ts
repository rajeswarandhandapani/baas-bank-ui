import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
    // Use dev-server proxy to avoid CORS: see proxy.conf.json (/chatbot -> http://localhost:8082)
    private baseUrl = '/chatbot';
    private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
    messages$ = this.messagesSubject.asObservable();

    constructor(private http: HttpClient) { }

    send(text: string) {
        // Add user message
        this.messagesSubject.next([
            ...this.messagesSubject.getValue(),
            { sender: 'user', text }
        ]);

        const params = new HttpParams().set('userInput', text);
        this.http
            .post<string>(`${this.baseUrl}/chat`, null, { params, responseType: 'text' as 'json' })
            .subscribe({
                next: (reply) => this.messagesSubject.next([
                    ...this.messagesSubject.getValue(),
                    { sender: 'bot', text: reply ?? '...' }
                ]),
                error: () => this.messagesSubject.next([
                    ...this.messagesSubject.getValue(),
                    { sender: 'bot', text: 'Sorry, something went wrong.' }
                ])
            });
    }
}
