import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Retro } from '../../models/retro.model';
import { RetroService } from '../../services/retro.service';

@Component({
  selector: 'app-retro',
  templateUrl: './retro.component.html',
  styleUrls: ['./retro.component.scss'],
})
export class RetroComponent implements OnInit {
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
      startCtrl: ['', Validators.required],
    });
    this.keepFormGroup = this.fb.group({
      keepCtrl: ['', Validators.required],
    });
    this.stopFormGroup = this.fb.group({
      stopCtrl: ['', Validators.required],
    });
    this.consolidateFormGroup = this.fb.group({
      consolidateCtrl: ['', Validators.required],
    });
    this.rankFormGroup = this.fb.group({
      rankCtrl: ['', Validators.required],
    });
  }
}
