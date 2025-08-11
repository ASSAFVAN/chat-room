import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message, AnswersMap, AnswerTypeKey } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private answersMap: AnswersMap = {};
  private messages$ = new BehaviorSubject<Message[]>([]);

  angularKeywords = [
    'angular',
    'rxjs',
    'subjects',
    'service',
    'components',
    'pipes',
    'directives',
    'forms',
    'animations',
    'testing',
    'routing',
    'react',
  ];

  private genericAnswers: string[] = [];
  private funnyComments: string[] = [];

  http = inject(HttpClient);

  constructor() {
    this.loadAnswers();
  }

  private loadAnswers(): void {
    this.http.get<AnswersMap>('bot-answers.json').subscribe((data) => {
      this.answersMap = data;
      this.genericAnswers = data['generic']?.general || [];
      this.funnyComments = data['funnyComments']?.general || [];
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
        this.addBotResponseWithFunnyComment(message.text);
      }, 1000);
    }
  }

  private analyzeQuestion(question: string): { type: AnswerTypeKey; keyword: string | null } {
    const lower = question.toLowerCase();

    const definitionPatterns = [
      /^what is/,
      /^define/,
      /^explain/,
      /^what does .* mean/,
    ];
    const usagePatterns = [
      /^how to/,
      /^how do i/,
      /^how can i/,
      /^usage of/,
      /^how does/,
    ];

    let type: AnswerTypeKey = 'general';

    if (definitionPatterns.some((pat) => pat.test(lower))) {
      type = 'definition';
    } else if (usagePatterns.some((pat) => pat.test(lower))) {
      type = 'usage';
    }

    const keyword = this.angularKeywords.find((k) => lower.includes(k)) || null;

    return { type, keyword };
  }

  private getBotAnswer(userMessage: string): string {
    const { type: questionType, keyword } = this.analyzeQuestion(userMessage);

    if (keyword) {
      const answerObj = this.answersMap[keyword];
      if (answerObj && questionType && answerObj[questionType]?.length) {
        const answers = answerObj[questionType]!;
        const randomIndex = Math.floor(Math.random() * answers.length);
        return answers[randomIndex];
      }
    }

    // fallback to generic answers
    if (this.genericAnswers.length > 0) {
      const randomGenericIndex = Math.floor(Math.random() * this.genericAnswers.length);
      return this.genericAnswers[randomGenericIndex];
    }

    return "Sorry, I don't have an answer for that. Can you ask something else?";
  }

  private addBotResponseWithFunnyComment(userMessage: string): void {
    const answer = this.getBotAnswer(userMessage);

    const isGenericAnswer = this.genericAnswers.includes(answer);

    if (!isGenericAnswer && this.funnyComments.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.funnyComments.length);
      const funnyComment = this.funnyComments[randomIndex];

      const funnyMessage: Message = {
        sender: '🤖 AngularBot',
        text: funnyComment,
        date: new Date(),
        isBot: true,
      };
      this.addMessage(funnyMessage);

      setTimeout(() => {
        const botMessage: Message = {
          sender: '🤖 AngularBot',
          text: answer,
          date: new Date(),
          isBot: true,
        };
        this.addMessage(botMessage);
      }, 1000);
    } else {
      const botMessage: Message = {
        sender: '🤖 AngularBot',
        text: answer,
        date: new Date(),
        isBot: true,
      };
      this.addMessage(botMessage);
    }
  }
}
