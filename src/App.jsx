import { View } from 'react-native';
import { useRef } from 'react';
import { observer } from 'mobx-react';
import mobx, { MobxContext } from '@/store';
import Player from '@/view/Player';
import VirtualKeypad from '@/component/VirtualKeypad';
import { KeypadListener } from '@/util';
import { EVENT_TYPE } from '@/constant';

function App() {
  const recordRef = useRef();

  const onPressRef = useRef(new Set());
  const onPress = (et) => {
    if (et === EVENT_TYPE.RECORD) {
      console.log(recordRef.current, 'recordRef.current');
      recordRef.current?.();
    }

    onPressRef.current.forEach((caller) => {
      caller(et);
    });
  };

  return (
    <MobxContext.Provider player={mobx.player} store={mobx} value={mobx}>
      <View
        style={{
          height: '100%',
          width: '100%',
          flex: 1,
          borderWidth: 0,
          borderColor: 'transparent',
        }}
      >
        <VirtualKeypad onPress={onPress} />
        <KeypadListener onPress={onPress} />
        <Player onPressRef={onPressRef} />
      </View>
    </MobxContext.Provider>
  );
}

export default observer(App);
