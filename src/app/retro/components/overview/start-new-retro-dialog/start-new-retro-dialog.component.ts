import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './start-new-retro-dialog.component.html',
  styleUrls: ['./start-new-retro-dialog.component.scss'],
})
export class StartNewRetroDialogComponent implements OnInit {
  sprintTitle: string;
  constructor(
    public dialogRef: MatDialogRef<StartNewRetroDialogComponent, StartNewRetroDialogResult>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: StartNewRetroDialogData
  ) {}

  ngOnInit(): void {
    this.sprintTitle = this.data?.sprintTitle ?? null;
  }

  submitHandler() {
    if (this.sprintTitle) {
      this.dialogRef.close({
        sprintTitle: this.sprintTitle,
      });
    }
  }

  cancelClickHandler() {
    this.dialogRef.close('cancel');
  }
}

export type StartNewRetroDialogData = {
  sprintTitle: string;
};

export type StartNewRetroDialogResult = undefined | 'cancel' | StartNewRetroDialogData;
