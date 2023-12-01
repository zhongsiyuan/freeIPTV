import { StyleSheet } from 'react-native';
import { px2dp } from '@/util';

export default StyleSheet.create({
  testKeyboard: {
    position: 'absolute',
    right: px2dp(50),
    bottom: px2dp(50),
    width: px2dp(400),
    padding: px2dp(32),
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: px2dp(15),
    zIndex: 99,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnWrap: {
    flex: 1,
  },
  middleBtnWrap: {
    margin: px2dp(16),
  },
  numWrap: {
    marginTop: px2dp(32),
  },
  numRow: {
    marginBottom: px2dp(16),
  },
  numMiddleBtnWrap: {
    marginHorizontal: px2dp(16),
  },
});
