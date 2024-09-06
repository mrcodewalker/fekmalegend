import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent {
  @Input() postTitle!: string;
  @Input() postContent!: string;
  isOpen = false;

  openPostDetail() {
    this.isOpen = true;
  }

  closePostDetail() {
    this.isOpen = false;
  }
}
