import { StyleSheet } from 'react-native';
import { px2dp } from '@/util/index';

export default StyleSheet.create({
  channelInfo: {
    position: 'absolute',
    left: '10%',
    bottom: px2dp(80),
    width: '80%',
    padding: px2dp(16),
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: px2dp(15),
  },
  left: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: px2dp(40),
    paddingVertical: px2dp(20),
    minWidth: px2dp(220),
  },
  no: {
    position: 'absolute',
    flexWrap: 'nowrap',
    top: px2dp(-50),
    fontSize: px2dp(55),
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: px2dp(2),
    textShadowOffset: { width: px2dp(4), height: px2dp(4) },
    color: 'rgba(255,255,255,0.8)',
  },
  title: {
    fontSize: px2dp(28),
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  right: {
    marginHorizontal: px2dp(20),
    paddingRight: px2dp(20),
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  rightTopText: {
    fontSize: px2dp(24),
    color: 'rgba(255,255,255,0.8)',
  },
  line: {
    marginVertical: px2dp(4),
    borderColor: 'rgba(255,255,255,0.3)',
    borderTopWidth: px2dp(2),
  },
  rightBottomText: {
    fontSize: px2dp(24),
    color: 'rgba(255,255,255,0.5)',
  },
});
