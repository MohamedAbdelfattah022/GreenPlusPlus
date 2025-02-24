import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  FileUp,
  Building2,
  Activity,
  Send,
  FileText,
  Zap,
  ArrowLeft,
} from 'lucide-angular';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { BuildingViewerComponent } from '../building-viewer/building-viewer.component';
import { AnalysisResultsComponent } from '../analysis-results/analysis-results.component';
import { ChatService } from './chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    FileUploadComponent,
    BuildingViewerComponent,
    AnalysisResultsComponent,
    FormsModule,
  ],
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.css'],
})
export class ChatInterfaceComponent implements AfterViewChecked {
  showUpload = false;
  showViewer = false;
  showAnalysis = false;
  showChat = false;
  selectedProject: string | null = null;
  newMessage: string = '';
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;

  constructor(private chatService: ChatService) {
    this.chatService.projectSelected$.subscribe((project) => {
      this.onProjectSelected(project);
    });
  }

  features = [
    {
      title: 'File Processing',
      description: 'Upload and analyze building documents',
      icon: FileText,
      action: () => (this.showUpload = true),
      examples: [
        'Upload IDF files for energy simulation',
        'Process building documentation',
        'Extract data from PDFs and drawings',
      ],
    },
    {
      title: '3D Visualization',
      description: 'Interactive building model viewer',
      icon: Building2,
      action: () => (this.showViewer = true),
      examples: [
        'View 3D building models',
        'Analyze building components',
        'Explore architectural details',
      ],
    },
    {
      title: 'Energy Analysis',
      description: 'Comprehensive energy performance insights',
      icon: Activity,
      action: () => (this.showAnalysis = true),
      examples: [
        'Generate energy audit reports',
        'Simulate building performance',
        'Get optimization recommendations',
      ],
    },
  ];

  dummyChats: {
    [key: string]: { sender: string; message: string; timestamp: string }[];
  } = {
    'Office Building Analysis': [
      {
        sender: 'AI',
        message: 'Analyzing office energy data...',
        timestamp: '10:00 AM',
      },
      {
        sender: 'User',
        message: 'What’s the HVAC efficiency?',
        timestamp: '10:01 AM',
      },
      {
        sender: 'AI',
        message: 'HVAC efficiency is at 85%. Suggest upgrading.',
        timestamp: '10:02 AM',
      },
    ],
    'Residential Complex Audit': [
      {
        sender: 'AI',
        message: 'Residential audit complete.',
        timestamp: '9:30 AM',
      },
      {
        sender: 'User',
        message: 'Any insulation recommendations?',
        timestamp: '9:31 AM',
      },
    ],
    'Shopping Mall Energy Sim': [
      {
        sender: 'AI',
        message: 'Simulation running for mall...',
        timestamp: '11:00 AM',
      },
    ],
    'Hospital HVAC Analysis': [
      { sender: 'AI', message: 'HVAC analysis started.', timestamp: '8:00 AM' },
    ],
    'School Building Review': [
      {
        sender: 'AI',
        message: 'School review in progress.',
        timestamp: '2:00 PM',
      },
    ],
    'Data Center Optimization': [
      {
        sender: 'AI',
        message: 'Optimizing data center cooling.',
        timestamp: '3:00 PM',
      },
    ],
  };

  mockAnalysisResults = {
    energyUsage: 250000,
    recommendations: [
      'Upgrade HVAC system efficiency',
      'Implement smart lighting controls',
      'Improve building envelope insulation',
    ],
    simulationData: [
      { month: 'Jan', usage: 25000 },
      { month: 'Feb', usage: 22000 },
      { month: 'Mar', usage: 20000 },
    ],
  };

  readonly FileText = FileText;
  readonly Building2 = Building2;
  readonly Activity = Activity;
  readonly Send = Send;
  readonly Zap = Zap;
  readonly ArrowLeft = ArrowLeft;

  onFileUpload(files: File[]) {
    console.log(files);
  }

  goBack() {
    this.showUpload = false;
    this.showViewer = false;
    this.showAnalysis = false;
  }

  onProjectSelected(project: string) {
    this.goBack();
    this.showChat = true;
    this.selectedProject = project;
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedProject) {
      const timestap = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      this.dummyChats[this.selectedProject].push({
        sender: 'User',
        message: this.newMessage,
        timestamp: timestap,
      });
      this.scrollToBottom();
      // AI response simulate
      setTimeout(() => {
        this.dummyChats[this.selectedProject!].push({
          sender: 'AI',
          message: `Received your message: "${this.newMessage}". How can I assist further?`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
        this.scrollToBottom();
      }, 1000);
      this.newMessage = '';
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  ngAfterViewChecked() {
    if (this.showChat && this.chatContainer) {
      console.log(
        'Scrolling',
        this.chatContainer.nativeElement.scrollHeight,
        this.chatContainer.nativeElement.scrollTop
      );

      this.scrollToBottom();
    }
  }

  private scrollToBottom() {
    if (this.chatContainer) {
      const element = this.chatContainer.nativeElement;
      console.log(
        'Scroll Height:',
        element.scrollHeight,
        'Current Top:',
        element.scrollTop
      ); // Debug
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth',
      });
    }
  }
}
