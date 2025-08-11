import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../models/message';

@Component({
  selector: 'app-message',
  imports: [CommonModule],
  templateUrl: './message.html',
  styleUrl: './message.scss',
})
export class MessageComponent {
  @Input() message!: Message;
  @HostBinding('class.align-bot')
  get alignBotClass() {
    return this.message?.isBot ?? false;
  }
}
