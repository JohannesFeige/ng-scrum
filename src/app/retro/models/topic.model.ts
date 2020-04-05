export type Topic = {
  key?: string;
  disabled?: boolean;
  topic: string;
  type: TopicType;
};

export type TopicType = 'start' | 'keep' | 'stop';
