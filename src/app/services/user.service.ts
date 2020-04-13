import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private adminSecret = 'foo';
  private currentTyped = '';
  user: User;
  constructor() {
    let userKey = window.localStorage.getItem('userKey');

    if (!userKey) {
      userKey = this.generateUserKey();
      localStorage.setItem('userKey', userKey);
    }

    this.user = {
      key: userKey,
      isAdmin: false,
    };

    window.addEventListener('keyup', this.globalKeypressHandler);
  }

  isAdmin() {
    return this.user.isAdmin;
  }

  private switchToAdmin() {
    this.user.isAdmin = true;
  }

  private generateUserKey() {
    let key = '';
    for (let index = 0; index < 4; index++) {
      key += Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(2, 10);
    }

    return key;
  }

  private globalKeypressHandler = (event: KeyboardEvent) => {
    this.currentTyped += event.key;

    if (this.adminSecret.indexOf(this.currentTyped) < 0) {
      this.currentTyped = '';
      return;
    }

    if (this.adminSecret === this.currentTyped) {
      this.switchToAdmin();
      this.currentTyped = '';
    }
  };
}
