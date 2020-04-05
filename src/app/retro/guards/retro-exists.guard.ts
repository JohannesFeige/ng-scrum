import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RetroService } from '../services/retro.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RetroExistsGuard implements CanActivate {
  constructor(private retroService: RetroService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const retroKey = next.params.key;
    return this.retroService.retroExists(retroKey).pipe(
      tap((x) => {
        console.log('retro exists', x);
      })
    );
  }
}
