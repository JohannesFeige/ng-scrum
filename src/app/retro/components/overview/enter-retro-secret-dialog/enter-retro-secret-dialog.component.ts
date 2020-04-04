import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './enter-retro-secret-dialog.component.html',
  styleUrls: ['./enter-retro-secret-dialog.component.scss'],
})
export class EnterRetroSecretDialogComponent implements OnInit {
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EnterRetroSecretDialogComponent, EnterRetroSecretDialogResult>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: EnterRetroSecretDialogData
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      retroSecret: [this.data?.retroSecret ?? '', Validators.required],
    });
  }

  submitHandler() {
    if (this.form.dirty && this.form.valid) {
      this.dialogRef.close({
        retroSecret: this.form.value.retroSecret,
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
