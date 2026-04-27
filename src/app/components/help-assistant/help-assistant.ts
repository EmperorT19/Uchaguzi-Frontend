import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
}

interface QuickReply {
  label: string;
  response: string;
}

@Component({
  selector: 'app-help-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help-assistant.html',
  styleUrls: ['./help-assistant.css']
})
export class HelpAssistantComponent {
  isOpen = false;
  userInput = '';
  isTyping = false;
  
  messages: ChatMessage[] = [
    { sender: 'bot', text: 'Hello! I am your Uchaguzi guide. How can I help you today?' }
  ];

  quickReplies: QuickReply[] = [
    { label: 'How to Register?', response: 'To register, click the "Register" button on the home page. You will need a valid Kenyan ID, a phone number, and you must select your County, Constituency, and Ward.' },
    { label: 'Who can vote?', response: 'Any Kenyan citizen over the age of 18 with a valid National ID or Passport who has registered on our platform can vote.' },
    { label: 'How to see Results?', response: 'You can view live election results by navigating to the "Results" section from the main menu or dashboard. Results are updated in real-time as votes are cast.' },
    { label: 'Forgot Password?', response: 'If you forgot your password, please contact a system administrator to have it reset. (Currently, there is no automated password reset link for security reasons).' }
  ];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.cdr.detectChanges();
  }

  handleReplyClick(reply: QuickReply) {
    this.addUserMessage(reply.label);
    
    this.isTyping = true;
    this.cdr.detectChanges();
    this.scrollToBottom();

    setTimeout(() => {
      this.isTyping = false;
      this.addBotMessage(reply.response);
      this.cdr.detectChanges();
    }, 600);
  }

  sendMessage() {
    if (!this.userInput.trim()) return;
    
    const messageText = this.userInput;
    this.userInput = ''; // clear input
    
    this.addUserMessage(messageText);
    
    this.isTyping = true;
    this.cdr.detectChanges();
    this.scrollToBottom();

    // Call the intelligent backend endpoint
    this.http.post<any>('http://127.0.0.1:8000/chat', { message: messageText }).subscribe({
      next: (res) => {
        // Small delay to simulate typing realistically
        setTimeout(() => {
          this.isTyping = false;
          this.addBotMessage(res.reply);
          this.cdr.detectChanges();
        }, 800);
      },
      error: (err) => {
        this.isTyping = false;
        this.addBotMessage("Sorry, I'm having trouble connecting to the server right now. Please try again later.");
        this.cdr.detectChanges();
      }
    });
  }

  addUserMessage(text: string) {
    this.messages = [...this.messages, { sender: 'user', text: text }];
    this.cdr.detectChanges();
    this.scrollToBottom();
  }

  addBotMessage(text: string) {
    this.messages = [...this.messages, { sender: 'bot', text: text }];
    this.cdr.detectChanges();
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 50);
  }
}
