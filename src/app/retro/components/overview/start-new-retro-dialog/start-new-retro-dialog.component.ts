import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './start-new-retro-dialog.component.html',
  styleUrls: ['./start-new-retro-dialog.component.scss'],
})
export class StartNewRetroDialogComponent implements OnInit {
  sprintTitle: string;
  votesPerUser: number;
  maxTopics: number;
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
        votesPerUser: Number.parseInt(this.votesPerUser.toString(), 10),
        maxTopics: Number.parseInt(this.maxTopics.toString(), 10),
      });
    }
  }

  canSubmit() {
    return this.sprintTitle && this.votesPerUser > 0 && this.maxTopics > 0;
  }
}

export type StartNewRetroDialogData = {
  sprintTitle: string;
  votesPerUser: number;
  maxTopics: number;
};

export type StartNewRetroDialogResult = undefined | 'cancel' | StartNewRetroDialogData;
