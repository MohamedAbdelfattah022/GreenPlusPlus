import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Send, Upload } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { ChatService, Message } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements AfterViewChecked {
  @Input() selectedProject: string | null = null;
  @Input() chats: { sender: string; message: string }[] = [];
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;

  newMessage: string = '';
  readonly Send = Send;
  readonly Upload = Upload;
  isStreaming: boolean = false;
  currentStreamedMessage: string = '';

  constructor(private chatService: ChatService) {}

  ngAfterViewChecked() {
    if (this.chatContainer) {
      const element = this.chatContainer.nativeElement;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  sendMessage() {
    if (this.newMessage.trim() && !this.isStreaming) {
      this.chats.push({
        sender: 'User',
        message: this.newMessage,
      });

      const messages: Message[] = this.chats.map((chat) => ({
        role: chat.sender.toLowerCase() === 'user' ? 'user' : 'assistant',
        content: chat.message,
      }));

      this.chats.push({
        sender: 'AI',
        message: '',
      });

      this.isStreaming = true;
      this.currentStreamedMessage = '';

      this.chatService.sendMessageStream(messages).subscribe({
        next: (response) => {
          if (response.text) {
            this.currentStreamedMessage += response.text;
            this.chats[this.chats.length - 1].message =
              this.currentStreamedMessage;
          }
        },
        error: (error) => {
          console.error('Error from chat service:', error);
          this.chats[this.chats.length - 1].message =
            'Error: Could not get response from LLM.';
          this.isStreaming = false;
        },
        complete: () => {
          this.isStreaming = false;
        },
      });

      this.newMessage = '';
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files).filter((file) =>
        this.isAcceptedFileType(file)
      );
      if (files.length > 0) {
        const fileNames = files.map((file) => file.name).join(', ');
        this.chats.push({
          sender: 'User',
          message: `Uploaded files: ${fileNames}`,
        });

        this.chats.push({
          sender: 'AI',
          message: `Received files: ${fileNames}. File processing would be implemented with streaming.`,
        });

        input.value = '';
      }
    }
  }

  private isAcceptedFileType(file: File): boolean {
    const acceptedTypes = [
      'application/pdf',
      'application/idf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];
    return (
      acceptedTypes.includes(file.type) ||
      (file.name.endsWith('.idf') && file.type === '')
    );
  }
}
