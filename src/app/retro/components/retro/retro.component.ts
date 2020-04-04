import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-retro',
  templateUrl: './retro.component.html',
  styleUrls: ['./retro.component.scss'],
})
export class RetroComponent implements OnInit {
  startFormGroup: FormGroup;
  keepFormGroup: FormGroup;
  stopFormGroup: FormGroup;
  consolidateFormGroup: FormGroup;
  rankFormGroup: FormGroup;

  retroKey: string;
  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.initForm();

    this.retroKey = this.route.snapshot.paramMap.get('key');
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
