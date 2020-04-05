import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import {
  StartNewRetroDialogComponent,
  StartNewRetroDialogData,
  StartNewRetroDialogResult,
} from './start-new-retro-dialog/start-new-retro-dialog.component';
import { Router } from '@angular/router';
import { RetroService } from '../../services/retro.service';
import { Retro } from '../../models/retro.model';
import {
  AlertDialogComponent,
  AlertDialogData,
  AlertDialogResult,
} from 'src/app/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  retros$: BehaviorSubject<Retro[]>;
  constructor(private retroService: RetroService, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.retros$ = this.retroService.getRetros();
  }

  newRetroClickHandler(): void {
    this.dialog
      .open<StartNewRetroDialogComponent, StartNewRetroDialogData, StartNewRetroDialogResult>(
        StartNewRetroDialogComponent,
        {
          width: '250px',
        }
      )
      .afterClosed()
      .subscribe((result) => {
        if (!result || result === 'cancel') {
          return;
        }

        const sprintTitle = (result as StartNewRetroDialogData).sprintTitle;
        const retroKey = this.retroService.pushRetro({
          title: sprintTitle,
        });

        this.router.navigate([`retro/${retroKey}`]);
      });
  }

  deleteRetro(retroKey: string): void {
    this.dialog
      .open<AlertDialogComponent, AlertDialogData, AlertDialogResult>(AlertDialogComponent, {
        width: '250px',
        data: {
          title: 'Delete Retro',
          text: 'Do you really want to delete this item?',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.retroService.deleteRetro(retroKey);
      });
  }
}
