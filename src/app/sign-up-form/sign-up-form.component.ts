// sign-up-form.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Eye,
  Building2,
  FileText,
  Activity,
} from 'lucide-angular';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css'],
})
export class SignUpFormComponent {
  @Output() complete = new EventEmitter<void>();

  onSubmit(event: Event) {
    event.preventDefault();
    this.complete.emit();
  }

  // Icon references for template
  readonly Eye = Eye;
  readonly Building2 = Building2;
  readonly FileText = FileText;
  readonly Activity = Activity;
}
