import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatRoom } from './components/chat-room/chat-room';

@Component({
  imports: [RouterModule, ChatRoom],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'chat-bot';
}
