import { Keep } from './keep.model';
import { Start } from './start.model';
import { Stop } from './stop.model';

export type Retro = {
  key?: string;
  title: string;
  currentStep: number;
  votesPerUser: number;
  maxTopics;
  start?: Start[];
  keep?: Keep[];
  stop?: Stop[];
};
