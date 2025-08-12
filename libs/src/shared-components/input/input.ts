import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  @Input() control!: FormControl;
  @Input() placeholder = 'Search...';
  @Input() type: 'text' | 'number' = 'text';
  @Input() clearIcon = '';
  @Input() fontSize = '14px';
  @Input() showClear = false;
  @Input() cssClass = '';
  @Input() wrapperClass = '';
  @Input() autofocus = false;

  @Output() iconClick = new EventEmitter<void>();
  @Output() valueChange = new EventEmitter<string>();
  @Output() submit = new EventEmitter<void>();

  constructor() {
    if (this.control) {
      this.control.valueChanges
        .pipe(takeUntilDestroyed())
        .subscribe((value) => {
          this.valueChange.emit(value);
        });
    }
  }

  clearValue(): void {
    this.control.setValue('');
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submit.emit();
    }
  }
}
