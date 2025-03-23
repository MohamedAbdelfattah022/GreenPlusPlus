import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Message {
  role: string;
  content: string;
}

export interface ChatResponse {
  text?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:5251/api/Chat/stream';

  constructor() {}

  sendMessageStream(
    messages: Message[],
    prompt: string = ''
  ): Observable<ChatResponse> {
    const responseSubject = new Subject<ChatResponse>();

    const requestBody = {
      messages: messages.length > 0 ? messages : undefined,
      prompt,
    };

    fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.body) {
          responseSubject.error('No response body');
          responseSubject.complete();
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const processStream = async () => {
          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              const lines = chunk.split('\n\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const textData = line.substring(6);
                  responseSubject.next({ text: textData });
                }
              }
            }
          } catch (error) {
            responseSubject.error(error);
          } finally {
            responseSubject.complete();
          }
        };

        processStream();
      })
      .catch((error) => {
        responseSubject.error(error);
        responseSubject.complete();
      });

    return responseSubject.asObservable();
  }
}
