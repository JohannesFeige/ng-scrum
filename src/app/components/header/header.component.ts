import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RetroService } from 'src/app/retro/services/retro.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  retroSecret: string;
  constructor(private retroService: RetroService) {}

  ngOnInit(): void {
    this.retroService.currentRetroKey$.subscribe((retroKey) => {
      if (retroKey) {
        this.retroSecret = this.retroService.getRetroSecret(retroKey);
      } else {
        this.retroSecret = null;
      }
    });
  }

  copySecretToClipboard() {
    window.navigator.clipboard.writeText(this.retroSecret);
  }
}
