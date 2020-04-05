import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './components/overview/overview.component';
import { RetroRoutingModule } from './retro-routing.module';
import { EnterRetroSecretDialogComponent } from './components/overview/enter-retro-secret-dialog/enter-retro-secret-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { StartNewRetroDialogComponent } from './components/overview/start-new-retro-dialog/start-new-retro-dialog.component';
import { RetroComponent } from './components/retro/retro.component';
import { ConsolidateStepComponent } from './components/retro/consolidate-step/consolidate-step.component';
import { RankStepComponent } from './components/retro/rank-step/rank-step.component';
import { CollectionStepComponent } from './components/retro/collection-step/collection-step.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    OverviewComponent,
    EnterRetroSecretDialogComponent,
    StartNewRetroDialogComponent,
    RetroComponent,
    ConsolidateStepComponent,
    RankStepComponent,
    CollectionStepComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    RetroRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatStepperModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
})
export class RetroModule {}
