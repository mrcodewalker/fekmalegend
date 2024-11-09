import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  @Input() isModalOpen: boolean = false;
  @Input() title: string = 'Xác nhận';
  @Input() message: string = 'Bạn có chắc muốn thực hiện hành động này?';
  @Input() confirmButtonText: string = 'OK';
  @Input() cancelButtonText: string = 'Cancel';
  @Output() confirm: EventEmitter<void> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Input() warningMessage: string | null = null;
  // Close modal
  closeModal(): void {
    this.isModalOpen = false;
    this.cancel.emit();
  }

  // Trigger confirm action
  confirmAction(): void {
    this.isModalOpen = false;
    this.confirm.emit();
  }
}
