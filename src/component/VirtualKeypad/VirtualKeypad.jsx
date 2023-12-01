import React from 'react';
import { View, Button } from 'react-native';
import { EVENT_TYPE } from '@/constant';
import style from './virtualKeypad.style';

export default ({ onPress }) => {
  return (
    <View style={style.testKeyboard}>
      <View>
        <View style={style.row}>
          <View style={style.btnWrap} />
          <View style={style.btnWrap}>
            <Button
              title={'↑'}
              onPress={() => onPress(EVENT_TYPE.UP)}
            />
          </View>
          <View style={style.btnWrap} />
        </View>
        <View style={style.row}>
          <View style={style.btnWrap}>
            <Button
              title={'←'}
              onPress={() => onPress(EVENT_TYPE.LEFT)}
            />
          </View>
          <View style={[style.btnWrap, style.middleBtnWrap]}>
            <Button
              title={'OK'}
              onPress={() => onPress(EVENT_TYPE.SELECT)}
            />
          </View>
          <View style={style.btnWrap}>
            <Button
              title={'→'}
              onPress={() => onPress(EVENT_TYPE.RIGHT)}
            />
          </View>
        </View>
        <View style={style.row}>
          <View style={style.btnWrap} />
          <View style={style.btnWrap}>
            <Button
              title={'↓'}
              onPress={() => onPress(EVENT_TYPE.DOWN)}
            />
          </View>
          <View style={style.btnWrap} />
        </View>
      </View>
      <View style={style.numWrap}>
        <View style={[style.row, style.numRow]}>
          <View style={style.btnWrap}>
            <Button
              title={'1'}
              onPress={() => onPress(EVENT_TYPE.I)}
            />
          </View>
          <View style={[style.btnWrap, style.numMiddleBtnWrap]}>
            <Button
              title={'2'}
              onPress={() => onPress(EVENT_TYPE.II)}
            />
          </View>
          <View style={style.btnWrap}>
            <Button
              title={'3'}
              onPress={() => onPress(EVENT_TYPE.III)}
            />
          </View>
        </View>
        <View style={[style.row, style.numRow]}>
          <View style={style.btnWrap}>
            <Button
              title={'4'}
              onPress={() => onPress(EVENT_TYPE.IV)}
            />
          </View>
          <View style={[style.btnWrap, style.numMiddleBtnWrap]}>
            <Button
              title={'5'}
              onPress={() => onPress(EVENT_TYPE.V)}
            />
          </View>
          <View style={style.btnWrap}>
            <Button
              title={'6'}
              onPress={() => onPress(EVENT_TYPE.VI)}
            />
          </View>
        </View>
        <View style={[style.row, style.numRow]}>
          <View style={style.btnWrap}>
            <Button
              title={'7'}
              onPress={() => onPress(EVENT_TYPE.VII)}
            />
          </View>
          <View style={[style.btnWrap, style.numMiddleBtnWrap]}>
            <Button
              title={'8'}
              onPress={() => onPress(EVENT_TYPE.VIII)}
            />
          </View>
          <View style={style.btnWrap}>
            <Button
              title={'9'}
              onPress={() => onPress(EVENT_TYPE.IX)}
            />
          </View>
        </View>
        <View style={[style.row, style.numRow]}>
          <View style={style.btnWrap} />
          <View style={[style.btnWrap, style.numMiddleBtnWrap]}>
            <Button
              title={'0'}
              onPress={() => onPress(EVENT_TYPE.X)}
            />
          </View>
          <View style={style.btnWrap}>
            <Button
              title={'Record'}
              onPress={() => onPress(EVENT_TYPE.RECORD)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
