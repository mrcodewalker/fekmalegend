import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-author-support',
  templateUrl: './author-support.component.html',
  styleUrls: ['./author-support.component.scss']
})
export class AuthorSupportComponent {
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
