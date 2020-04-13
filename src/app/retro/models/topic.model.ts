export type Topic = {
  key?: string;
  disabled?: boolean;
  topic: string;
  type: TopicType;
  votes: Vote[];
  isHot?: boolean;
};

export type Vote = {
  key?: string;
  user: string;
};

export type TopicType = 'start' | 'keep' | 'stop';
