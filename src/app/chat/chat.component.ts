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

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements AfterViewChecked {
  @Input() selectedProject: string | null = null;
  @Input() chats: { sender: string; message: string; timestamp: string }[] = [];
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;

  newMessage: string = '';
  readonly Send = Send;
  readonly Upload = Upload;

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
    if (this.newMessage.trim()) {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      this.chats.push({
        sender: 'User',
        message: this.newMessage,
        timestamp: timestamp,
      });

      // AI response simulation
      setTimeout(() => {
        this.chats.push({
          sender: 'AI',
          message: `Received your message: "${this.newMessage}". How can I assist further?`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
      }, 1000);
      this.newMessage = '';
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
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
        const timestamp = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        const fileNames = files.map((file) => file.name).join(', ');
        this.chats.push({
          sender: 'User',
          message: `Uploaded files: ${fileNames}`,
          timestamp: timestamp,
        });

        // AI response simulation for file upload
        setTimeout(() => {
          this.chats.push({
            sender: 'AI',
            message: `Received files: ${fileNames}. How can I assist with these?`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          });
        }, 1000);

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
