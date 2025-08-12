import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.html',
  styleUrls: ['./tag.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  @Input() text = '';
  @Input() color = 'white';
  @Input() backgroundColor = 'darkblue';
  @Input() hoveringColor = 'blue';

  @Output() clicked = new EventEmitter<string>();

  @HostBinding('style.--bg-color') get bgColor() {
    return this.backgroundColor;
  }
  @HostBinding('style.--hover-color') get hoverColor() {
    return this.hoveringColor;
  }

  onClick(): void {
    this.clicked.emit(this.text);
  }
}
