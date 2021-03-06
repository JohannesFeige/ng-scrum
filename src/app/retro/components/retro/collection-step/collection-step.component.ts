import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Topic, TopicType } from '../../../models/topic.model';
import { RetroService } from '../../../services/retro.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-collection-step',
  templateUrl: './collection-step.component.html',
  styleUrls: ['./collection-step.component.scss'],
})
export class CollectionStepComponent implements OnInit {
  @Input() type: TopicType;
  @Input() retroKey: string;

  @ViewChild('form') formRef: FormGroupDirective;
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  title: string;
  pushFn: (retroKey: string) => void;
  getFn: (retroKey: string) => void;
  topic: string;
  topics: BehaviorSubject<Topic[]>;

  constructor(private retroService: RetroService, private userService: UserService) {}

  ngOnInit(): void {
    this.init();
    this.topics = this.retroService.getTopics(this.retroKey, this.type);
  }

  topicSubmitHandler() {
    this.submit();
  }

  private submit() {
    const topic: Topic = {
      type: this.type,
      topic: this.topic,
      votes: [],
    };

    this.retroService.pushTopic(this.retroKey, topic);
    this.topic = null;
  }

  hasNext() {
    return this.next.observers.length;
  }

  hasPrevious() {
    return this.previous.observers.length;
  }

  isAdmin() {
    return this.userService.isAdmin();
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

  keyPressHandler(event: KeyboardEvent) {
    if (this.topic && event.key === 'Enter' && event.ctrlKey) {
      this.submit();
    }
  }
}
