import { Component, OnInit, ViewChild } from '@angular/core';
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
export class RetroComponent implements OnInit {
  @ViewChild('stepper') private stepper: MatStepper;

  isLinear = true;

  retro: BehaviorSubject<Retro>;
  startFormGroup: FormGroup;
  keepFormGroup: FormGroup;
  stopFormGroup: FormGroup;
  consolidateFormGroup: FormGroup;
  rankFormGroup: FormGroup;

  retroKey: string;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private retroService: RetroService) {}

  ngOnInit(): void {
    this.initForm();

    this.retroKey = this.route.snapshot.paramMap.get('key');
    this.retro = this.retroService.getRetro(this.retroKey);
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
  }

  nextClickHandler() {
    this.stepper.selected.completed = false;
    this.stepper.next();
  }

  previousClickHandler() {
    this.stepper.selected.completed = false;
    this.stepper.previous();
  }
}
