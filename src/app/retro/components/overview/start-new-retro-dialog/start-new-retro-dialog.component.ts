import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './start-new-retro-dialog.component.html',
  styleUrls: ['./start-new-retro-dialog.component.scss'],
})
export class StartNewRetroDialogComponent implements OnInit {
  sprintTitle: string;
  constructor(
    public dialogRef: MatDialogRef<StartNewRetroDialogComponent, StartNewRetroDialogResult>,
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
}

export type StartNewRetroDialogData = {
  sprintTitle: string;
};

export type StartNewRetroDialogResult = undefined | 'cancel' | StartNewRetroDialogData;
