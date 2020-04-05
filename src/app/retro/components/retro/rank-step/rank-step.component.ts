import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rank-step',
  templateUrl: './rank-step.component.html',
  styleUrls: ['./rank-step.component.scss'],
})
export class RankStepComponent implements OnInit {
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  hasNext() {
    return this.next.observers.length;
  }

  hasPrevious() {
    return this.previous.observers.length;
  }
}
