import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageList } from './message-list';
import { Message } from '../../models/message';
import { ElementRef } from '@angular/core';

describe('MessageList', () => {
  let component: MessageList;
  let fixture: ComponentFixture<MessageList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageList],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call scrollTo on the messageListDiv element', () => {
    const scrollMock = jest.fn();
    const mockElement = {
      scrollTo: scrollMock,
      scrollHeight: 500,
    } as unknown as HTMLElement;

    component.messageListDiv = new ElementRef(mockElement);

    component.scrollToBottom();

    expect(scrollMock).toHaveBeenCalledWith({
      top: 500,
      behavior: 'smooth',
    });
  });
});
