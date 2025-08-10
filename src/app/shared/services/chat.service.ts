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
    private messagesSubject = new BehaviorSubject<ChatMessage[]>([
        { sender: 'bot', text: 'Welcome to BaaS Bank. How can I help you today? I can help with viewing your BAAS Bank accounts, transactions, payments, and notifications' }
    ]);
    messages$ = this.messagesSubject.asObservable();
    private loadingSubject = new BehaviorSubject<boolean>(false);
    isLoading$ = this.loadingSubject.asObservable();

    constructor(private http: HttpClient) { }

    send(text: string) {
        // Add user message
        this.messagesSubject.next([
            ...this.messagesSubject.getValue(),
            { sender: 'user', text }
        ]);

        const params = new HttpParams().set('userInput', text);
        this.loadingSubject.next(true);
        this.http
            .post<string>(`${this.baseUrl}/chat`, null, { params, responseType: 'text' as 'json' })
            .subscribe({
                next: (reply) => {
                    this.messagesSubject.next([
                        ...this.messagesSubject.getValue(),
                        { sender: 'bot', text: reply ?? '...' }
                    ]);
                    this.loadingSubject.next(false);
                },
                error: () => {
                    this.messagesSubject.next([
                        ...this.messagesSubject.getValue(),
                        { sender: 'bot', text: 'Sorry, something went wrong.' }
                    ]);
                    this.loadingSubject.next(false);
                }
            });
    }
}
