import { useTVEventHandler } from 'react-native';
import { EVENT_TYPE } from '@/constant';

const EVENT_TYPES = new Set();

Object.values(EVENT_TYPE).forEach((v) => {
  EVENT_TYPES.add(v);
});

/**
 * keypadListener
 * @param onPress
 */
export default ({ onPress }) => {
  const myTVEventHandler = (e) => {
    const { eventType } = e;
    if (EVENT_TYPES.has(eventType)) {
      onPress(eventType);
    }
  };

  useTVEventHandler(myTVEventHandler);
};
