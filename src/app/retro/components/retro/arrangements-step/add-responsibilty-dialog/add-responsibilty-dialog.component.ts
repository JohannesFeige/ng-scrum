import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './add-responsibilty-dialog.component.html',
  styleUrls: ['./add-responsibilty-dialog.component.scss'],
})
export class AddResponsibiltyDialogComponent implements OnInit {
  responsible: string;

  constructor(
    public dialogRef: MatDialogRef<AddResponsibiltyDialogComponent, AddResponsibleDialogResult>,
    @Inject(MAT_DIALOG_DATA) private data: AddResponsibleDialogData
  ) {}

  ngOnInit(): void {
    this.responsible = this.data?.responsible ?? null;
  }

  submitHandler() {
    if (this.responsible) {
      this.dialogRef.close({
        responsible: this.responsible,
      });
    }
  }
}

export type AddResponsibleDialogData = {
  responsible: string;
};

export type AddResponsibleDialogResult = undefined | 'cancel' | AddResponsibleDialogData;
