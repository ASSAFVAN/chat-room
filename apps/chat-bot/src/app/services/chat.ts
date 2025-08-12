import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../models/message';
import { AnswersMap, AnswerTypeKey } from '../models/answer';


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
    'signals',
    'change detection',
    'ngrx',
    'react',
  ];

  private genericAnswers: string[] = [];
  private funnyComments: string[] = [];
  private greetings: string[] = [];
  private followupQuestions: string[] = [];

  private awaitingFollowUp = false;
  private lastTopicKey: string | null = null;
private lastAnswerType: AnswerTypeKey | null = null;

  http = inject(HttpClient);

  constructor() {
    this.loadAnswers();
  }

  private loadAnswers(): void {
    this.http.get<AnswersMap>('bot-answers.json').subscribe((data) => {
      this.answersMap = data;
      this.genericAnswers = data['generic']?.general || [];
      this.funnyComments = data['funnyComments']?.general || [];
      this.greetings = data['greetings']?.general || [];
      this.followupQuestions = data['followupQuestions'].general || [];
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

  private analyzeQuestion(question: string): {
    type: AnswerTypeKey;
    keyword: string | null;
  } {
    const lowerCase = question.toLowerCase();

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

    if (definitionPatterns.some((pat) => pat.test(lowerCase))) {
      type = 'definition';
    } else if (usagePatterns.some((pat) => pat.test(lowerCase))) {
      type = 'usage';
    }

    const keyword = this.identifySubjectKeyword(lowerCase);
    return { type, keyword };
  }

  private isGreetings(message: string): boolean {
    const greetingsArray = ['hello', 'hi', 'hey'];
    return greetingsArray.some((greet) =>
      message.toLowerCase().includes(greet)
    );
  }

  private getBotAnswer(userMessage: string): string {
    if (this.isGreetings(userMessage) && this.greetings.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.greetings.length);
      return this.greetings[randomIndex];
    }
    const { type: questionType, keyword } = this.analyzeQuestion(userMessage);

    if (keyword) {
      const answerObj = this.answersMap[keyword];
      if (answerObj && questionType && answerObj[questionType]?.length) {
        const answers = answerObj[questionType]!;
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

    return "Sorry, I don't have an answer for that. Can you ask something else?";
  }

  private identifySubjectKeyword(message: string): string | null {
    const lowerCase = message.toLowerCase();
    let subjectKeyword: string | null = null;
    let bestIndex = Infinity;

    for (const keyword of this.angularKeywords) {
      const index = lowerCase.indexOf(keyword);
      if (index !== -1 && index < bestIndex) {
        bestIndex = index;
        subjectKeyword = keyword;
      }
    }
    return subjectKeyword;
  }

  private getExtraeAnswer(topicKey: string, type: AnswerTypeKey): string {
    const answers = this.answersMap[topicKey]?.[type];
    if (answers && answers.length > 0) {
      const randomIndex = Math.floor(Math.random() * answers.length);
      return answers[randomIndex];
    }
    return "Sorry, I don't have an example for that topic.";
  }

  private addBotResponseWithFunnyComment(userMessage: string): void {
    if (this.awaitingFollowUp) {
        const lowerCase = userMessage.toLowerCase();
        const followUpAnswers = ['yes', 'sure', 'yeah', 'yep', 'of course'];
        if (followUpAnswers.some(answer => lowerCase.includes(answer))) {
            this.awaitingFollowUp = false;
            if (this.lastTopicKey && this.lastAnswerType) {
                const extraAnswer = this.getExtraeAnswer(this.lastTopicKey, this.lastAnswerType);
                setTimeout(() => {
                    this.addMessage({
                        sender: '🤖 AngularBot',
                        text: extraAnswer,
                        date: new Date(),
                        isBot: true,
                    });
                }, 1500)
                return;
            }
        } else {
            this.awaitingFollowUp = false;
            this.addMessage({
                sender: '🤖 AngularBot',
                text: "No problem, let's move on! 🚀",
                date: new Date(),
                isBot: true,
            });
            return;
        }
    }
    const { type: questionType, keyword } = this.analyzeQuestion(userMessage);

    const answer = this.getBotAnswer(userMessage);

    const isGreetings = this.greetings.includes(answer);
    const isGenericAnswer = this.genericAnswers.includes(answer);

    if (keyword && !isGenericAnswer && !isGreetings) {
    this.lastTopicKey = keyword;
    this.lastAnswerType = questionType;
    this.awaitingFollowUp = true;

    setTimeout(() => {
    this.addMessage({
      sender: '🤖 AngularBot',
      text: this.followupQuestions[Math.floor(Math.random() * this.followupQuestions.length)],
      date: new Date(),
      isBot: true,
    });
  }, 1500);
  }

    if (!isGenericAnswer && !isGreetings && this.funnyComments.length > 0) {
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
