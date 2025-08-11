import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageComponent } from './message';
import { Message } from '../../models/message';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    component.message = { isBot: false } as Message;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

    it('should add align-bot class when message.isBot is true', () => {
      component.message = { isBot: true } as Message;
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains('align-bot')).toBe(true);
    });

    it('should not add align-bot class when message.isBot is false', () => {
      component.message = { isBot: false } as Message;
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains('align-bot')).toBe(false);
    });
});
