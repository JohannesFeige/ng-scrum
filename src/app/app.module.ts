import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RetroModule } from './retro/retro.module';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent, NotFoundComponent, AlertDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    RetroModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'scrum'),
    AngularFireDatabaseModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
