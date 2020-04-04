import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './enter-retro-secret-dialog.component.html',
  styleUrls: ['./enter-retro-secret-dialog.component.scss'],
})
export class EnterRetroSecretDialogComponent implements OnInit {
  retroSecret: string;
  constructor(
    public dialogRef: MatDialogRef<EnterRetroSecretDialogComponent, EnterRetroSecretDialogResult>,
    @Inject(MAT_DIALOG_DATA) private data: EnterRetroSecretDialogData
  ) {}

  ngOnInit(): void {
    this.retroSecret = this.data?.retroSecret ?? null;
  }

  submitHandler() {
    if (this.retroSecret) {
      this.dialogRef.close({
        retroSecret: this.retroSecret,
      });
    }
  }

  cancelClickHandler() {
    this.dialogRef.close('cancel');
  }
}

export type EnterRetroSecretDialogData = {
  retroSecret: string;
};

export type EnterRetroSecretDialogResult = undefined | 'cancel' | EnterRetroSecretDialogData;
