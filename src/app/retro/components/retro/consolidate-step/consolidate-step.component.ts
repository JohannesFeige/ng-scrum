import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Topic } from 'src/app/retro/models/topic.model';
import { RetroService } from 'src/app/retro/services/retro.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-consolidate-step',
  templateUrl: './consolidate-step.component.html',
  styleUrls: ['./consolidate-step.component.scss'],
})
export class ConsolidateStepComponent implements OnInit {
  @Input() retroKey: string;
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  starts$: BehaviorSubject<Topic[]>;
  keeps$: BehaviorSubject<Topic[]>;
  stops$: BehaviorSubject<Topic[]>;
  constructor(private retroService: RetroService, private userService: UserService) {}

  ngOnInit(): void {
    this.starts$ = this.retroService.getTopics(this.retroKey, 'start');
    this.keeps$ = this.retroService.getTopics(this.retroKey, 'keep');
    this.stops$ = this.retroService.getTopics(this.retroKey, 'stop');
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

  toggleTopicDisabled(topic: Topic) {
    topic.disabled = !topic.disabled;
    this.retroService.updateTopicDisabled(this.retroKey, topic);
  }
}
