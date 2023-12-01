import { Text, View } from 'react-native';
import React from 'react';
import style from './channelInfo.style';

export default ({ channel }) => {
  return (
    <View style={style.channelInfo}>
      <View style={style.left}>
        <Text style={style.no}>{channel.channelNum}</Text>
        <Text style={style.title}>{channel.title}</Text>
      </View>
      <View style={style.right}>
        <Text style={style.rightTopText}>当前节目：15:47 谁说我xxx第26集</Text>
        <View style={style.line} />
        <Text style={style.rightBottomText}>下一节目：15:47 谁说我xxx第26集</Text>
      </View>
    </View>
  );
};
