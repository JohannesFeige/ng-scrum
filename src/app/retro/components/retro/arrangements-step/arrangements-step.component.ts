import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RetroService } from 'src/app/retro/services/retro.service';
import { UserService } from 'src/app/services/user.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Topic } from 'src/app/retro/models/topic.model';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import {
  AddResponsibiltyDialogComponent,
  AddResponsibleDialogData,
  AddResponsibleDialogResult,
} from './add-responsibilty-dialog/add-responsibilty-dialog.component';

@Component({
  selector: 'app-arrangements-step',
  templateUrl: './arrangements-step.component.html',
  styleUrls: ['./arrangements-step.component.scss'],
})
export class ArrangementsStepComponent implements OnInit {
  @Input() retroKey: string;
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  private maxTopics = 5;

  private starts$: BehaviorSubject<Topic[]>;
  private keeps$: BehaviorSubject<Topic[]>;
  private stops$: BehaviorSubject<Topic[]>;
  topics$: BehaviorSubject<Topic[]> = new BehaviorSubject([]);
  constructor(private retroService: RetroService, private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.starts$ = this.retroService.getActiveTopics(this.retroKey, 'start');
    this.keeps$ = this.retroService.getActiveTopics(this.retroKey, 'keep');
    this.stops$ = this.retroService.getActiveTopics(this.retroKey, 'stop');

    this.retroService.getRetro(this.retroKey).subscribe((retro) => {
      this.maxTopics = retro.maxTopics;

      this.combineTopics();
    });
  }

  addResonsible(topic: Topic) {
    this.dialog
      .open<AddResponsibiltyDialogComponent, AddResponsibleDialogData, AddResponsibleDialogResult>(
        AddResponsibiltyDialogComponent,
        {
          width: '350px',
          data: {
            responsible: topic.responsible,
          },
        }
      )
      .afterClosed()
      .subscribe((result) => {
        if (!result || result === 'cancel') {
          return;
        }

        this.retroService.updateTopicResponsible(this.retroKey, topic, result.responsible);
      });
  }

  private combineTopics() {
    combineLatest([this.starts$, this.stops$, this.keeps$])
      .pipe(
        map(([start, keep, stop]) => [...start, ...keep, ...stop]),
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
    return this.topics$.pipe(map((topics) => topics.filter((topic) => !topic.isHot && topic.votes.length)));
  }

  getColdTopics() {
    return this.topics$.pipe(map((topics) => topics.filter((topic) => !topic.votes.length)));
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
}
