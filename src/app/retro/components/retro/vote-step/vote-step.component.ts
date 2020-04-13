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
  votesPerUser = 5;
  maxTopics = 5;

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

    this.retroService.getRetro(this.retroKey).subscribe((retro) => {
      this.votesPerUser = retro.votesPerUser;
      this.maxTopics = retro.maxTopics;

      this.combineTopics();
    });
  }

  private combineTopics() {
    combineLatest([this.starts$, this.stops$, this.keeps$])
      .pipe(
        map(([start, keep, stop]) => [...start, ...keep, ...stop]),
        map((topics) => topics.filter((x) => x.votes.length)),
        map((topics) => topics.sort((a, b) => b.votes.length - a.votes.length)),
        map((topics) => {
          const hotTopics: Topic[] = [];
          let minimumVotes = 0;

          topics.forEach((topic) => {
            if (hotTopics.length < this.maxTopics || topic.votes.length >= minimumVotes) {
              topic.isHot = true;
              hotTopics.push(topic);
              minimumVotes = topic.votes.length;
            } else {
              topic.isHot = false;
            }
          });

          return topics;
        })
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

  getHotTopics() {
    return this.topics$.pipe(map((topics) => topics.filter((topic) => topic.isHot)));
  }

  getWarmTopics() {
    return this.topics$.pipe(map((topics) => topics.filter((topic) => !topic.isHot)));
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

  getUserVotesAmount(topic: Topic) {
    return topic.votes.filter((x) => x.user === this.userKey).length;
  }

  getVotesLeft() {
    const votesCount = this.topics$.value
      .reduce((acc, topic) => acc.concat(...topic.votes), [] as Vote[])
      .filter((votes) => votes.user === this.userKey).length;

    return this.votesPerUser - votesCount;
  }

  canPullVote(topic: Topic) {
    return !!topic.votes.filter((x) => x.user === this.userKey).length;
  }

  trackTopic(topic: Topic): string {
    return topic.key;
  }

  isAdmin() {
    return this.userService.isAdmin();
  }

  hasNext() {
    return this.next.observers.length;
  }

  hasPrevious() {
    return this.previous.observers.length;
  }
}
