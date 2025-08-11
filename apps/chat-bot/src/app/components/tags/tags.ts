import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TagComponent } from '@shared-components/tag/tag';
import { shuffleArray } from '@utils/utils';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.html',
  styleUrls: ['./tags.scss'],
  imports: [TagComponent],
  standalone: true,
})
export class TagsComponent implements OnInit {
  @Input() tags: string[] = [];
  @Input() maxTags = 5;

  @Output() tagSelected = new EventEmitter<string>();

  displayedTags: string[] = [];

  ngOnInit() {
    this.displayedTags = shuffleArray(this.tags).slice(0, this.maxTags);
  }
}
