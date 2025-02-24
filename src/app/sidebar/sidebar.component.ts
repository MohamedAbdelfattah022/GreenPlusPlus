import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  PlusCircle,
  Settings,
  FileText,
  HelpCircle,
} from 'lucide-angular';
import { ChatService } from '../chat-interface/chat.service';
import { mockChats } from '../chat-interface/mock-data';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Output() projectSelected = new EventEmitter<string>();
  constructor(private chatService: ChatService) {}

  projects = Object.keys(mockChats);

  readonly PlusCircle = PlusCircle;
  readonly FileText = FileText;
  readonly HelpCircle = HelpCircle;
  readonly Settings = Settings;

  onProjectClick(project: string) {
    this.chatService.selectProject(project);
  }
}
