import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  PlusCircle,
  Settings,
  FileText,
  HelpCircle,
  Building2,
  Activity,
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
  selectedProject: string | null = null;
  projects = Object.keys(mockChats);

  constructor(private chatService: ChatService) {
    this.chatService.projectSelected$.subscribe((project) => {
      this.selectedProject = project;
    });
  }

  readonly PlusCircle = PlusCircle;
  readonly FileText = FileText;
  readonly HelpCircle = HelpCircle;
  readonly Settings = Settings;
  readonly Building2 = Building2;
  readonly Activity = Activity;

  onProjectClick(project: string) {
    this.chatService.selectProject(project);
  }

  onNewChat() {
    const newProjectTitle = this.generateUniqueChatTitle();
    this.projects = [newProjectTitle, ...this.projects];
    this.chatService.selectProject(newProjectTitle);
  }

  private generateUniqueChatTitle(): string {
    let index = this.projects.length + 1;
    let newTitle = `Chat ${index}`;
    while (this.projects.includes(newTitle)) {
      index++;
      newTitle = `Chat ${index}`;
    }
    return newTitle;
  }
}
