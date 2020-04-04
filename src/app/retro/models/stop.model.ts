import { Topic } from './topic.model';

export type Stop = Topic & {
  type: 'stop';
};
