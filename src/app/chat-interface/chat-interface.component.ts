import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, FileUp, Zap, ArrowLeft } from 'lucide-angular';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { BuildingViewerComponent } from '../building-viewer/building-viewer.component';
import { AnalysisResultsComponent } from '../analysis-results/analysis-results.component';
import { ChatService } from './chat.service';
import { ChatComponent } from '../chat/chat.component';
import {
  mockFeatures,
  mockChats,
  mockAnalysisResults,
  Feature,
} from './mock-data';

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    FileUploadComponent,
    BuildingViewerComponent,
    AnalysisResultsComponent,
    ChatComponent,
  ],
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.css'],
})
export class ChatInterfaceComponent {
  showUpload = false;
  showViewer = false;
  showAnalysis = false;
  showChat = false;
  selectedProject: string | null = null;

  constructor(private chatService: ChatService) {
    this.chatService.projectSelected$.subscribe((project) => {
      this.onProjectSelected(project);
    });
  }

  // Initialize features with actions bound to component context
  features: Feature[] = mockFeatures.map((feature) => ({
    ...feature,
    action:
      feature.title === 'File Processing'
        ? () => (this.showUpload = true)
        : feature.title === '3D Visualization'
        ? () => (this.showViewer = true)
        : () => (this.showAnalysis = true),
  }));

  dummyChats = mockChats;
  mockAnalysisResults = mockAnalysisResults;

  readonly ArrowLeft = ArrowLeft;
  readonly Zap = Zap;

  onFileUpload(files: File[]) {
    console.log(files);
  }

  goBack() {
    this.showUpload = false;
    this.showViewer = false;
    this.showAnalysis = false;
    this.showChat = false;
    this.selectedProject = null;
  }

  onProjectSelected(project: string) {
    this.goBack();
    this.showChat = true;
    this.selectedProject = project;
  }
}
