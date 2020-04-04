export type Topic = {
  key?: string;
  topic: string;
  type: TopicType;
};

export type TopicType = 'start' | 'keep' | 'stop';
