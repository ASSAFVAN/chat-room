import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../models/message';

interface AnswersMap {
  [keyword: string]: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private answersMap: AnswersMap = {};
  private messages$ = new BehaviorSubject<Message[]>([]);
  private angularKeywords = ['component', 'directive', 'rxjs', 'react'];
  private genericAnswers: string[] = [];
  private funnyComments: string[] = [];

  http = inject(HttpClient);
  constructor() {
    this.loadAnswers();
  }

  private loadAnswers(): void {
    this.http.get<AnswersMap>('bot-answers.json').subscribe((data) => {
      this.answersMap = data;
      this.genericAnswers = data['generic'] || [];
      this.funnyComments = data['funnyComments'] || [];
    });
  }

  getMessages(): Observable<Message[]> {
    return this.messages$.asObservable();
  }

  addMessage(message: Message): void {
    const current = this.messages$.value;
    this.messages$.next([...current, message]);

    if (!message.isBot) {
      setTimeout(() => {
        //   const botResponse = this.getBotAnswer(message.text);
        //   if (botResponse) {
        //     this.addBotMessageTypingEffect(botResponse);
        //   }
        this.addBotResponseWithFunnyComment(message.text);
      }, 1000);
    }
  }

  private addBotMessageTypingEffect(fullText: string): void {
    const typingMessage: Message = {
      sender: '🤖 AngularBot',
      text: '',
      date: new Date(),
      isBot: true,
    };

    this.addMessage(typingMessage);

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      typingMessage.text = fullText.slice(0, currentIndex);
      const messages = this.messages$.value;
      this.messages$.next([...messages]);

      if (currentIndex === fullText.length) {
        clearInterval(interval);
      }
    }, 50);
  }

  private addBotResponseWithFunnyComment(userMessage: string): void {
    const answer = this.getBotAnswer(userMessage);
    let fullAnswer = answer;

    if (this.funnyComments.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.funnyComments.length);
      const funnyComment = this.funnyComments[randomIndex];
      fullAnswer = `${funnyComment}\n\n${answer}`;

      const funnyMessage: Message = {
      sender: '🤖 AngularBot',
      text: funnyComment,
      date: new Date(),
      isBot: true,
    };
    this.addMessage(funnyMessage)

    setTimeout(() => {
      const botMessage: Message = {
        sender: '🤖 AngularBot',
        text: answer,
        date: new Date(),
        isBot: true,
      };
      this.addMessage(botMessage);
    }, 1000);

    }

    // const botMessage: Message = {
    //     sender: '🤖 AngularBot',
    //     text: fullAnswer,
    //     date: new Date(),
    //     isBot: true,
    // };

    // this.addMessage(botMessage);

    

    // this.addBotMessageTypingEffect(fullAnswer);
  }

  private getBotAnswer(userMessage: string): string {
    const lower = userMessage.toLowerCase();
    const keyword = this.angularKeywords.find((k) => lower.includes(k));

    if (keyword) {
      const answers = this.answersMap[keyword];
      if (answers && answers.length) {
        const randomIndex = Math.floor(Math.random() * answers.length);
        return answers[randomIndex];
      }
    }

    if (this.genericAnswers.length > 0) {
      const randomGenericIndex = Math.floor(
        Math.random() * this.genericAnswers.length
      );
      return this.genericAnswers[randomGenericIndex];
    }

    return 'Sorry, I don\'t have an answer for that. Can you ask something else?';
  }
}
