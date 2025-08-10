import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat';
import { Message } from '../../models/message';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageList } from '../message-list/message-list';
import { InputComponent } from '@shared-components/input/input';

@Component({
  selector: 'app-chat-room',
  imports: [
    CommonModule,
    FormsModule,
    MessageList,
    InputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './chat-room.html',
  styleUrl: './chat-room.scss',
})
export class ChatRoom implements OnInit {
  messages: Message[] = [];
  @ViewChild(MessageList) messageListComponent!: MessageList;
  form = new FormGroup({
    messageControl: new FormControl(''),
  });

  get messageControl(): FormControl<string | null> {
    return this.form.get('messageControl') as FormControl<string | null>;
  }

  chatService = inject(ChatService);

  ngOnInit(): void {
    this.chatService.getMessages().subscribe((msgs) => {
      this.messages = msgs;
      setTimeout(() => {
        this.messageListComponent.scrollToBottom();
      }, 0);
    });
  }

  sendMessage(): void {
    const text = this.messageControl.value?.trim();
    if (!text) return;

    const message: Message = {
      sender: 'You',
      text,
      date: new Date(),
    };

    this.chatService.addMessage(message);
    this.messageControl.setValue('');
  }
}
