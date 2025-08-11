import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ChatService } from './chat';
import { provideHttpClient } from '@angular/common/http';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;

  const mockAnswersMap = {
    component: ['Component answer 1', 'Component answer 2'],
    directive: ['Directive answer'],
    rxjs: ['RxJS answer'],
    react: ['React answer'],
    generic: ['Generic answer 1', 'Generic answer 2'],
    funnyComments: ['Funny comment 1', 'Funny comment 2'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            provideHttpClient(),
            provideHttpClientTesting(),
        ]
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a generic answer if no keyword found', () => {
    const svcAny = service as ChatService;
    const answer = svcAny['getBotAnswer']('this is unrelated text');
    expect(mockAnswersMap.generic).toContain(answer);
  });


});
