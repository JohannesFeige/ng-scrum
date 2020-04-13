import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User;
  constructor() {
    let userKey = window.localStorage.getItem('userKey');

    if (!userKey) {
      userKey = this.generateUserKey();
      localStorage.setItem('userKey', userKey);
    }

    this.user = {
      key: userKey,
    };
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
}
