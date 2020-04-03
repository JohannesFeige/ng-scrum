import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './start-new-retro-dialog.component.html',
  styleUrls: ['./start-new-retro-dialog.component.scss'],
})
export class StartNewRetroDialogComponent implements OnInit {
  newRetroForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<StartNewRetroDialogComponent, StartNewRetroDialogResult>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: StartNewRetroDialogData
  ) {}

  ngOnInit(): void {
    this.newRetroForm = this.fb.group({
      sprintTitle: [this.data?.sprintTitle ?? '', Validators.required],
    });
  }

  submitHandler() {
    if (this.newRetroForm.dirty && this.newRetroForm.valid) {
      this.dialogRef.close({
        sprintTitle: this.newRetroForm.value.sprintTitle,
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
