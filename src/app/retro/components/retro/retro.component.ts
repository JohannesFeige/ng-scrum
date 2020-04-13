import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Retro } from '../../models/retro.model';
import { RetroService } from '../../services/retro.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-retro',
  templateUrl: './retro.component.html',
  styleUrls: ['./retro.component.scss'],
})
export class RetroComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') private stepper: MatStepper;

  retro$: BehaviorSubject<Retro>;
  startFormGroup: FormGroup;
  keepFormGroup: FormGroup;
  stopFormGroup: FormGroup;
  consolidateFormGroup: FormGroup;
  rankFormGroup: FormGroup;
  arrangementsFormGroup: FormGroup;

  retroKey: string;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private retroService: RetroService) {}

  ngOnInit(): void {
    this.initForm();

    this.retroKey = this.route.snapshot.paramMap.get('key');
    this.retroService.currentRetroKey$.next(this.retroKey);
    this.retro$ = this.retroService.getRetro(this.retroKey);

    this.retro$.subscribe((value) => {
      if (value && value.currentStep != null) {
        this.stepper.selectedIndex = value.currentStep;
      }
    });
  }

  ngOnDestroy(): void {
    this.retroService.currentRetroKey$.next(null);
  }

  private initForm() {
    this.startFormGroup = this.fb.group({
      startCtrl: [''],
    });
    this.keepFormGroup = this.fb.group({
      keepCtrl: [''],
    });
    this.stopFormGroup = this.fb.group({
      stopCtrl: [''],
    });
    this.consolidateFormGroup = this.fb.group({
      consolidateCtrl: [''],
    });
    this.rankFormGroup = this.fb.group({
      rankCtrl: [''],
    });
    this.arrangementsFormGroup = this.fb.group({
      arangementsCtrl: [''],
    });
  }

  nextClickHandler() {
    this.retroService.updateRetroCurrentSteop(this.retroKey, this.retro$.value.currentStep + 1);
  }

  previousClickHandler() {
    this.retroService.updateRetroCurrentSteop(this.retroKey, this.retro$.value.currentStep - 1);
  }
}
