import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../models/message';
import { MessageComponent } from '../message/message';

@Component({
  selector: 'app-message-list',
  imports: [CommonModule, MessageComponent],
  templateUrl: './message-list.html',
  styleUrl: './message-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageList {
  @Input() messages: Message[] = [];
  @ViewChild('messageList') messageListDiv!: ElementRef;

  scrollToBottom(): void {
    const el = this.messageListDiv.nativeElement as HTMLElement;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }
}
