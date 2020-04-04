import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Topic, TopicType } from '../../../models/topic.model';
import { RetroService } from '../../../services/retro.service';

@Component({
  selector: 'app-collection-step',
  templateUrl: './collection-step.component.html',
  styleUrls: ['./collection-step.component.scss'],
})
export class CollectionStepComponent implements OnInit {
  @Input() type: TopicType;
  @Input() retroKey: string;

  @ViewChild('topicForm') formRef: FormGroupDirective;

  title: string;
  pushFn: (retroKey: string) => void;
  getFn: (retroKey: string) => void;
  form: FormGroup;
  topics: BehaviorSubject<Topic[]>;

  constructor(private fb: FormBuilder, private retroService: RetroService) {}

  ngOnInit(): void {
    this.init();

    this.form = this.fb.group({
      topic: ['', Validators.required],
    });

    this.topics = this.retroService.getTopics(this.retroKey, this.type);
  }

  topicSubmitHandler() {
    const topic: Topic = {
      type: this.type,
      topic: this.form.value.topic,
    };

    this.retroService.pushTopic(this.retroKey, topic);
    this.formRef.resetForm();
  }

  private init() {
    switch (this.type) {
      case 'start':
        this.title = 'Start';
        break;
      case 'keep':
        this.title = 'Keep';
        break;
      case 'stop':
        this.title = 'Stop';
        break;
    }
  }
}
