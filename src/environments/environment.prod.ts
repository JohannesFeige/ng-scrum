import { apiKey, appId, messagingSenderId } from './sensitive';

export const environment = {
  production: true,
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
