import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { getTakeUntilDestroyed } from '../../utils/utils';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class InputComponent implements OnInit {
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

  takeUntilDestroyed = getTakeUntilDestroyed();

//   ngOnInit(): void {
//     if (this.control) {
//       this.control.valueChanges
//         .pipe(this.takeUntilDestroyed())
//         .subscribe((value) => {
//           this.valueChange.emit(value);
//         });
//     }
//   }

ngOnInit(): void {
    if (this.control) {
      this.control.valueChanges.subscribe(value => {
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
