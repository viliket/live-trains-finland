import EventEmitter from 'events';

export default class MqttClient extends EventEmitter {
  subscriptions: string[] = [];
  subscribe = (topic: string | string[], callback?: () => void) => {
    this.subscriptions.push(
      ...(Array.isArray(topic) ? (topic as string[]) : [topic])
    );
    if (callback) {
      callback();
    }
  };
  unsubscribe = (topic: string, callback?: () => void) => {
    var topicIdx = this.subscriptions.indexOf(topic);
    if (topicIdx !== -1) {
      this.subscriptions.splice(topicIdx, 1);
    }
    if (callback) {
      callback();
    }
  };
  publish = jest.fn();
  end = jest.fn();
}
