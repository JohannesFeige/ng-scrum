import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { map } from 'rxjs/operators';
import { RetroService } from '../services/retro.service';
import {
  EnterRetroSecretDialogComponent,
  EnterRetroSecretDialogData,
  EnterRetroSecretDialogResult,
} from '../components/overview/enter-retro-secret-dialog/enter-retro-secret-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class CanActivateRetroGuard implements CanActivate {
  constructor(private router: Router, private dialog: MatDialog, private retroService: RetroService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const retroKey = next.params.key;
    if (this.retroService.getRetroSecret(retroKey)) {
      return true;
    }

    return this.dialog
      .open<EnterRetroSecretDialogComponent, EnterRetroSecretDialogData, EnterRetroSecretDialogResult>(
        EnterRetroSecretDialogComponent,
        {
          width: '350px',
        }
      )
      .afterClosed()
      .pipe(
        map((result) => {
          if (!result || result === 'cancel') {
            return this.router.parseUrl('/');
          }

          this.retroService.setRetroSecret(retroKey, (result as EnterRetroSecretDialogData).retroSecret);

          return true;
        })
      );
  }
}
