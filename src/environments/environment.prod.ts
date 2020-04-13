import { apiKey, appId, messagingSenderId, adminSecret } from './sensitive';

export const environment = {
  production: true,
  adminSecret,
  firebase: {
    apiKey,
    authDomain: 'ng-scrum.firebaseapp.com',
    databaseURL: 'https://ng-scrum.firebaseio.com',
    projectId: 'ng-scrum',
    storageBucket: 'ng-scrum.appspot.com',
    messagingSenderId,
    appId,
  },
};
