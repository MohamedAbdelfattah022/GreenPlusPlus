import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';

export interface Message {
  role: string;
  content: string;
}

export interface ChatResponse {
  text?: string;
  content?: string;
}

export interface FileUploadResponse {
  url?: string;
  error?: string;
  content?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = environment.apiUrl;

  constructor(private authService: AuthService) {
  }

  private getAuthHeaders(): Record<string, string> {
    const session = this.authService.getSession();
    return {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      'Authorization': `Bearer ${session?.access_token || ''}`
    };
  }

  private getFileUploadHeaders(): Record<string, string> {
    const session = this.authService.getSession();
    return {
      'Accept': 'text/event-stream',
      'Authorization': `Bearer ${session?.access_token || ''}`
    };
  }

  private handleStreamingResponse<T>(
    response: Response,
    responseSubject: Subject<T>,
    parseDataFunction: (jsonData: any) => T
  ): void {
    if (!response.body) {
      throw new Error('No response body available for streaming');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const processStream = async () => {
      try {
        while (true) {
          const {done, value} = await reader.read();

          if (done) {
            console.log('Stream completed');
            responseSubject.complete();
            break;
          }

          const chunk = decoder.decode(value, {stream: true});
          buffer += chunk;

          console.log('Raw chunk received:', chunk);

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            console.log('Processing line:', line);

            if (line.startsWith('data: ')) {
              const dataStr = line.substring(6).trim();
              console.log('Data string:', dataStr);

              if (dataStr === '[DONE]' || dataStr === '') {
                console.log('End marker or empty data, continuing');
                continue;
              }

              try {
                const jsonData = JSON.parse(dataStr);
                console.log('Parsed JSON:', jsonData);

                const parsedResponse = parseDataFunction(jsonData);
                console.log('Parsed response:', parsedResponse);

                responseSubject.next(parsedResponse);
              } catch (parseError) {
                console.warn('Error parsing JSON from stream:', parseError);
                console.warn('Problematic data:', dataStr);

                if (dataStr.trim()) {
                  const fallbackResponse = parseDataFunction({content: dataStr});
                  responseSubject.next(fallbackResponse);
                }
              }
            } else if (line.trim() && !line.startsWith(':')) {
              console.log('Non-data line:', line);
            }
          }
        }
      } catch (streamError) {
        console.error('Error processing stream:', streamError);
        const errorMessage = streamError instanceof Error ? streamError.message : String(streamError);
        responseSubject.error(`Error processing response stream: ${errorMessage}`);
      }
    };

    processStream();
  }

  sendMessageStream(
    messages: Message[],
    prompt: string = ''
  ): Observable<ChatResponse> {
    const responseSubject = new Subject<ChatResponse>();
    let accumulatedContent = '';

    const requestBody = {
      message: prompt || (messages.length > 0 ? messages[messages.length - 1].content : ''),
    };

    const headers = this.getAuthHeaders();

    console.log('Sending message request:', requestBody);

    fetch(`${this.apiUrl}message`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
      credentials: 'include'
    })
      .then(response => {
        console.log('Message response received:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.handleStreamingResponse(
          response,
          responseSubject,
          (jsonData) => {
            if (jsonData.content) {
              accumulatedContent += jsonData.content;
              return {
                text: jsonData.content,
                content: accumulatedContent
              };
            }
            return {text: jsonData.text || ''};
          }
        );
      })
      .catch(error => {
        console.error('Error in sendMessageStream:', error);
        responseSubject.error(`Error connecting to the model: ${error.message}`);
      });

    return responseSubject.asObservable();
  }

  uploadFile(file: File, prompt: string = ''): Observable<FileUploadResponse> {
    const responseSubject = new Subject<FileUploadResponse>();
    let accumulatedContent = '';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);

    const headers = this.getFileUploadHeaders();

    console.log('Uploading file:', file.name, 'with prompt:', prompt);

    fetch(`${this.apiUrl}upload`, {
      method: 'POST',
      headers: headers,
      body: formData,
      credentials: 'include'
    })
      .then(response => {
        console.log('Upload response received:', response.status, response.statusText);
        console.log('Upload response headers:', response.headers);

        const contentType = response.headers.get('content-type');
        console.log('Upload response content-type:', contentType);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.handleStreamingResponse(
          response,
          responseSubject,
          (jsonData) => {
            console.log('Processing upload JSON data:', jsonData);

            const result: FileUploadResponse = {};

            if (jsonData.content) {
              accumulatedContent += jsonData.content;
              result.content = accumulatedContent;
            }

            if (jsonData.url) {
              result.url = jsonData.url;
            }

            if (jsonData.error) {
              result.error = jsonData.error;
            }

            if (!jsonData.content && !jsonData.url && !jsonData.error) {
              const contentStr = JSON.stringify(jsonData);
              accumulatedContent += contentStr;
              result.content = accumulatedContent;
            }

            console.log('Upload parsed result:', result);
            return result;
          }
        );
      })
      .catch(error => {
        console.error('Error in uploadFile:', error);
        responseSubject.error(`Error uploading file: ${error.message}`);
      });

    return responseSubject.asObservable();
  }
}
