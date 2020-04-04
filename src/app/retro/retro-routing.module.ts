import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './components/overview/overview.component';
import { RetroComponent } from './components/retro/retro.component';
import { CanActivateRetroGuard } from './guards/can-activate-retro.guard';

const routes: Routes = [
  {
    path: 'retro',
    children: [
      { path: '', component: OverviewComponent },
      { path: ':key', component: RetroComponent, canActivate: [CanActivateRetroGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RetroRoutingModule {}
