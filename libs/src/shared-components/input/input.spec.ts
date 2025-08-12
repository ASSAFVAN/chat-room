import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   it('should emit valueChange on control value changes', () => {
    jest.spyOn(component.valueChange, 'emit');
    component.control.setValue('test value');
    expect(component.valueChange.emit).toHaveBeenCalledWith('test value');
  });

  it('clearValue should clear the control value', () => {
    component.control.setValue('some value');
    component.clearValue();
    expect(component.control.value).toBe('');
  });

  it('onKeyDown should emit submit event on Enter key', () => {
    jest.spyOn(component.submit, 'emit');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onKeyDown(event);
    expect(component.submit.emit).toHaveBeenCalled();
  });
});
