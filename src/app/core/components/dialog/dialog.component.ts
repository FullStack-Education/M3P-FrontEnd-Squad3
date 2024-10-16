import { Component, Inject } from '@angular/core';
import {
  DialogRef,
  DIALOG_DATA,
  DialogModule,
} from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface IDialogButtons {
  label: string;
  action: string;
  visible: Boolean;
}

export interface IDialogData {
  message: string;
  actions: IDialogButtons[] | null;
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [FormsModule, DialogModule, CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  constructor(
    @Inject(DIALOG_DATA) public data: IDialogData,
    public dialogRef: DialogRef<string>
  ) {}

  runAction(action: string) {
    if (action === 'close') {
      this.close();
    } else {
      this.submit();
    }
  }

  close() {
    this.dialogRef.close('close action');
  }

  submit() {
    this.dialogRef.close('submit action');
  }
}
