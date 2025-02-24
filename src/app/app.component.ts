// app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatInterfaceComponent } from './chat-interface/chat-interface.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SignUpFormComponent,
    CommonModule,
    SidebarComponent,
    ChatInterfaceComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showSignUp = true;

  onSignUpComplete() {
    this.showSignUp = false;
  }

  onProjectSelected(project: string) {
    const chatInterface = this.chatInterface;
    if (chatInterface) {
      chatInterface.onProjectSelected(project);
    }
  }
  chatInterface?: ChatInterfaceComponent;
}
