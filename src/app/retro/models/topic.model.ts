export type Topic = {
  key?: string;
  disabled?: boolean;
  topic: string;
  type: TopicType;
  responsible?: string;
  votes: Vote[];
  isHot?: boolean;
};

export type Vote = {
  key?: string;
  user: string;
};

export type TopicType = 'start' | 'keep' | 'stop';
