// // sidebar.component.ts
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   LucideAngularModule,
//   PlusCircle,
//   FileUp,
//   Building2,
//   Activity,
//   Settings,
//   FileText,
//   Search,
//   HelpCircle,
// } from 'lucide-angular';

// @Component({
//   selector: 'app-sidebar',
//   standalone: true,
//   imports: [CommonModule, LucideAngularModule],
//   templateUrl: './sidebar.component.html',
//   styleUrls: ['./sidebar.component.css'],
// })
// export class SidebarComponent {
//   projects = [
//     'Office Building Analysis',
//     'Residential Complex Audit',
//     'Shopping Mall Energy Sim',
//     'Hospital HVAC Analysis',
//     'School Building Review',
//     'Data Center Optimization',
//   ];

//   // Icon references for template
//   readonly PlusCircle = PlusCircle;
//   readonly FileUp = FileUp;
//   readonly Building2 = Building2;
//   readonly Activity = Activity;
//   readonly Settings = Settings;
//   readonly FileText = FileText;
//   readonly Search = Search;
//   readonly HelpCircle = HelpCircle;
// }

// sidebar.component.ts
import { Component, EventEmitter, Output } from '@angular/core'; // Added EventEmitter, Output
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  PlusCircle,
  FileUp,
  Building2,
  Activity,
  Settings,
  FileText,
  Search,
  HelpCircle,
} from 'lucide-angular';
import { ChatService } from '../chat-interface/chat.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Output() projectSelected = new EventEmitter<string>(); // Emit selected project name
  constructor(private chatService: ChatService) {}

  projects = [
    'Office Building Analysis',
    'Residential Complex Audit',
    'Shopping Mall Energy Sim',
    'Hospital HVAC Analysis',
    'School Building Review',
    'Data Center Optimization',
  ];

  // Icon references for template
  readonly PlusCircle = PlusCircle;
  readonly FileUp = FileUp;
  readonly Building2 = Building2;
  readonly Activity = Activity;
  readonly Settings = Settings;
  readonly FileText = FileText;
  readonly Search = Search;
  readonly HelpCircle = HelpCircle;

  // onProjectClick(project: string) {
  //   this.projectSelected.emit(project);
  // }
  onProjectClick(project: string) {
    this.chatService.selectProject(project);
  }
}
