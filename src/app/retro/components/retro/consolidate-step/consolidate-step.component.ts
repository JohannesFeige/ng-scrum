import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-consolidate-step',
  templateUrl: './consolidate-step.component.html',
  styleUrls: ['./consolidate-step.component.scss'],
})
export class ConsolidateStepComponent implements OnInit {
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
