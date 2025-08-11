import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatRoom } from './chat-room';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChatService } from '../../services/chat';
import { of } from 'rxjs';

describe('ChatRoom', () => {
  let component: ChatRoom;
  let fixture: ComponentFixture<ChatRoom>;
  let chatServiceMock: any;

  beforeEach(async () => {
    chatServiceMock = {
      angularKeywords: ['angular', 'rxjs', 'service', 'components', 'pipes'],
      addMessage: jest.fn(),
      getMessages: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [ChatRoom],
      providers: [
            provideHttpClient(),
            provideHttpClientTesting(),
            { provide: ChatService, useValue: chatServiceMock },
        ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatRoom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sendMessage should not call addMessage if empty', () => {
    component.messageControl.setValue('');
    component.sendMessage();
    expect(chatServiceMock.addMessage).not.toHaveBeenCalled();
  });

  it('sendMessage should call addMessage if text exists', () => {
    component.messageControl.setValue('angular');
    component.sendMessage();
    expect(chatServiceMock.addMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        sender: 'You',
        text: 'angular',
      })
    );
    expect(component.messageControl.value).toBe('');
  });

  it('onTagClick should send message with capitalized tag', () => {
    component.onTagClick('angular');
    expect(chatServiceMock.addMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Angular',
      })
    );
  });
});
