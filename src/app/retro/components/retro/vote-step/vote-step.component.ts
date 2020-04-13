import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Topic, Vote } from 'src/app/retro/models/topic.model';
import { RetroService } from 'src/app/retro/services/retro.service';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-vote-step',
  templateUrl: './vote-step.component.html',
  styleUrls: ['./vote-step.component.scss'],
})
export class VoteStepComponent implements OnInit {
  @Input() retroKey: string;
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  userKey: string;
  maxVotes = 5;

  starts$: BehaviorSubject<Topic[]>;
  keeps$: BehaviorSubject<Topic[]>;
  stops$: BehaviorSubject<Topic[]>;
  topics$: BehaviorSubject<Topic[]> = new BehaviorSubject([]);
  constructor(private retroService: RetroService, private userService: UserService) {}

  ngOnInit(): void {
    this.userKey = this.userService.user.key;

    this.starts$ = this.retroService.getActiveTopics(this.retroKey, 'start');
    this.keeps$ = this.retroService.getActiveTopics(this.retroKey, 'keep');
    this.stops$ = this.retroService.getActiveTopics(this.retroKey, 'stop');

    combineLatest([this.starts$, this.stops$, this.keeps$])
      .pipe(
        map(([start, keep, stop]) => [...start, ...keep, ...stop]),
        map((topics) => topics.sort((a, b) => b.votes.length - a.votes.length))
      )
      .subscribe({
        complete: () => {
          return this.topics$.complete();
        },
        error: (x) => {
          return this.topics$.error(x);
        },
        next: (x) => {
          return this.topics$.next(x);
        },
      });
  }

  pushVote(topic: Topic) {
    const vote: Vote = {
      user: this.userKey,
    };
    this.retroService.pushTopicVote(this.retroKey, topic, vote);
  }

  pullVote(topic: Topic) {
    const [vote] = topic.votes.filter((x) => x.user === this.userKey);
    if (!vote) {
      return;
    }
    this.retroService.pullTopicVote(this.retroKey, topic, vote);
  }

  getVotesLeft() {
    const votesCount = this.topics$.value
      .reduce((acc, topic) => acc.concat(...topic.votes), [] as Vote[])
      .filter((votes) => votes.user === this.userKey).length;

    return this.maxVotes - votesCount;
  }

  canPullVote(topic: Topic) {
    return !!topic.votes.filter((x) => x.user === this.userKey).length;
  }

  trackTopic(topic: Topic): string {
    return topic.key;
  }

  hasNext() {
    return this.next.observers.length;
  }

  hasPrevious() {
    return this.previous.observers.length;
  }
}
