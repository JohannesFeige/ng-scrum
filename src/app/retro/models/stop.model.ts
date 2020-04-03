import Topic from './topic.model';

type Stop = Topic & {
  type: 'stop';
};

export default Stop;
