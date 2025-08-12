import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ChatService } from './chat';
import { provideHttpClient } from '@angular/common/http';
import { Message } from '../models/message';
import { AnswersMap } from '../models/answer';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;

  const mockAnswersMap: AnswersMap = {
    angular: {
      definition: ['Angular definition answer'],
      usage: ['Angular usage answer'],
      general: ['Angular general answer'],
    },
    rxjs: {
      definition: ['RxJS definition answer'],
      usage: ['RxJS usage answer'],
      general: ['RxJS general answer'],
    },
    generic: {
      general: ['Generic answer 1', 'Generic answer 2'],
    },
    funnyComments: {
      general: ['Funny comment 1', 'Funny comment 2'],
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);

    const req = httpMock.expectOne('bot-answers.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockAnswersMap);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created and load answers', () => {
    expect(service).toBeTruthy();
    const chatService = service as ChatService;
    expect(chatService['answersMap']).toEqual(mockAnswersMap);
    expect(chatService['genericAnswers']).toEqual(mockAnswersMap['generic'].general);
    expect(chatService['funnyComments']).toEqual(
      mockAnswersMap['funnyComments'].general
    );
  });

  it('should analyze question correctly - usage type', () => {
    const chatService = service as ChatService;
    const result = chatService['analyzeQuestion']('How do I use RxJS?');
    expect(result.type).toBe('usage');
    expect(result.keyword).toBe('rxjs');
  });

  it('should analyze question with no keyword', () => {
    const chatService = service as ChatService;
    const result = chatService['analyzeQuestion']('Tell me something unrelated');
    expect(result.type).toBe('general');
    expect(result.keyword).toBeNull();
  });

  it('should return keyword-based answer for definition question', () => {
    const chatService = service as ChatService;
    const answer = chatService['getBotAnswer']('What is Angular?');
    expect(mockAnswersMap['angular'].definition).toContain(answer);
  });

  it('should return generic answer if no keyword found', () => {
    const chatService = service as ChatService;
    const answer = chatService['getBotAnswer']('Tell me something unrelated');
    expect(mockAnswersMap['generic'].general).toContain(answer);
  });

  it('should return fallback answer if no answers found', () => {
    const chatService = service as ChatService;
    chatService['genericAnswers'] = [];
    chatService['answersMap'] = {};
    const answer = chatService['getBotAnswer']('No data here');
    expect(answer).toBe(
      "Sorry, I don't have an answer for that. Can you ask something else?"
    );
  });

  it('should add user message and only one bot message if answer is generic (no funny comment)', fakeAsync(() => {
    const userMessage: Message = {
      sender: 'User',
      text: 'Tell me something unrelated',
      date: new Date(),
      isBot: false,
    };

    let receivedMessages: Message[] = [];
    service.getMessages().subscribe((msgs) => (receivedMessages = msgs));

    service.addMessage(userMessage);
    expect(receivedMessages.length).toBe(1);

    tick(1000);

    expect(receivedMessages.length).toBe(2);
    expect(receivedMessages[1].isBot).toBe(true);
    expect(mockAnswersMap['generic'].general).toContain(
      receivedMessages[1].text
    );
  }));

  it('should add only user message if message is from bot (no bot reply)', fakeAsync(() => {
    const botMessage: Message = {
      sender: '🤖 AngularBot',
      text: 'Hello!',
      date: new Date(),
      isBot: true,
    };

    let receivedMessages: Message[] = [];
    service.getMessages().subscribe((msgs) => (receivedMessages = msgs));

    service.addMessage(botMessage);
    expect(receivedMessages.length).toBe(1);

    tick(2000);

    expect(receivedMessages.length).toBe(1);
  }));

  it('getExtraeAnswer should return random answer if available', () => {
    const chatService = service as ChatService;
    chatService['answersMap'] = {
      angular: {
        definition: ['Answer 1', 'Answer 2', 'Answer 3'],
      },
    };
    const topicKey = 'angular';
    const type = 'definition';
    for (let i = 0; i < 10; i++) {
      const answer = chatService['getExtraeAnswer'](topicKey, type);
      expect(chatService['answersMap'][topicKey][type]).toContain(answer);
    }
  });

  it('getExtraeAnswer should return fallback string if no answers', () => {
    const chatService = service as ChatService;
    chatService['answersMap'] = {
      angular: {
        definition: [],
      },
    };
    const answer = chatService['getExtraeAnswer']('angular', 'definition');
    expect(answer).toBe("Sorry, I don't have an example for that topic.");
  });

  describe('addBotResponseWithFunnyComment', () => {
  let chatService: ChatService;

  beforeEach(() => {
    chatService = service as ChatService;

    chatService['awaitingFollowUp'] = false;
    chatService['lastTopicKey'] = null;
    chatService['lastAnswerType'] = null;

    chatService['genericAnswers'] = ['generic answer'];
    chatService['funnyComments'] = ['funny comment'];
    chatService['greetings'] = ['hi', 'hello'];
    chatService['followupQuestions'] = ['Do you want an example?'];

    chatService['getExtraeAnswer'] = jest.fn().mockReturnValue('Extra answer');
    chatService['getBotAnswer'] = jest.fn().mockReturnValue('normal answer');
    chatService['analyzeQuestion'] = jest.fn().mockReturnValue({ type: 'definition', keyword: 'angular' });

    jest.spyOn(chatService, 'addMessage');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle affirmative follow-up and add extra answer after 1500ms', fakeAsync(() => {
    chatService['awaitingFollowUp'] = true;
    chatService['lastTopicKey']  = 'angular';
    chatService['lastAnswerType'] = 'definition';

    const userMessage = 'Yes, please!';

    chatService['addBotResponseWithFunnyComment'](userMessage);
    expect(chatService.addMessage).not.toHaveBeenCalled();

    tick(1500);

    expect(chatService.addMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        sender: '🤖 AngularBot',
        text: 'Extra answer',
        isBot: true,
      })
    );
    expect(chatService['awaitingFollowUp']).toBe(false);
  }));

  it('should handle negative follow-up and add no-problem message immediately', () => {
    chatService['awaitingFollowUp'] = true;
    const userMessage = 'No, thanks';

    chatService['addBotResponseWithFunnyComment'](userMessage);

    expect(chatService.addMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        sender: '🤖 AngularBot',
        text: "No problem, let's move on! 🚀",
        isBot: true,
      })
    );
    expect(chatService['awaitingFollowUp']).toBe(false);
  });

  it('should handle normal question and add follow-up question + funny comment + answer', fakeAsync(() => {
    chatService['awaitingFollowUp'] = false;
    chatService['getBotAnswer'] = jest.fn().mockReturnValue('not generic or greeting answer');
    chatService['analyzeQuestion'] = jest.fn().mockReturnValue({ type: 'definition', keyword: 'angular' });

    const userMessage = 'Explain Angular';

    chatService['addBotResponseWithFunnyComment'](userMessage);

    expect(chatService['awaitingFollowUp']).toBe(true);
    expect(chatService['lastTopicKey']).toBe('angular');
    expect(chatService['lastAnswerType']).toBe('definition');
    expect(chatService.addMessage).toHaveBeenCalledTimes(1);

    tick(0);

    expect(chatService.addMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        sender: '🤖 AngularBot',
        text: 'funny comment',
        isBot: true,
      })
    );

    tick(1000);

    expect(chatService.addMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        sender: '🤖 AngularBot',
        text: 'not generic or greeting answer',
        isBot: true,
      })
    );

    tick(500);
    expect(chatService.addMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        sender: '🤖 AngularBot',
        text: expect.stringMatching(/Do you want an example\?/),
        isBot: true,
      })
    );
  }));

  it('should add only bot answer if answer is generic or greeting', () => {
    chatService['awaitingFollowUp'] = false;
    chatService['getBotAnswer'] = jest.fn().mockReturnValue('generic answer');
    chatService['genericAnswers'] = ['generic answer'];
    chatService['greetings'] = ['hi'];
    chatService['analyzeQuestion'] = jest.fn().mockReturnValue({ type: 'definition', keyword: 'angular' });


    chatService['addBotResponseWithFunnyComment']('Hi there');

    expect(chatService.addMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        sender: '🤖 AngularBot',
        text: 'generic answer',
        isBot: true,
      })
    );

    expect(chatService.addMessage).toHaveBeenCalledTimes(1);
  });
});
});
