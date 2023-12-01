import { StyleSheet } from 'react-native';
import { px2dp } from '@/util';

export default StyleSheet.create({
  videoWrap: {
    zIndex: -1,
  },
  videoMask: {
    zIndex: 0,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  loading: {
    height: '50%',
  },
  errorWrap: {
    marginTop: px2dp(100),
    marginLeft: px2dp(160),
    flexDirection: 'row',
    alignItems: 'center',
  },
  errIcon: {
    marginRight: px2dp(86),
    marginBottom: px2dp(28),
    fontSize: px2dp(140),
    color: '#fff',
  },
  errInfo: {
    marginBottom: px2dp(8),
    fontSize: px2dp(24),
    color: '#fff',
  },
  largeInfo: {
    marginBottom: px2dp(16),
    fontSize: px2dp(32),
  },
  video: {
    height: '100%',
  },
  hide: {
    display: 'none',
  },
  player: {
    backgroundColor: '#76adff',
    height: '100%',
    width: '100%',
  },
  inputNumWrap: {
    position: 'absolute',
    right: px2dp(50),
    top: px2dp(50),
    padding: px2dp(12),
    minWidth: px2dp(140),
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: px2dp(15),
    zIndex: 999,
  },
  inputNum: {
    textAlign: 'center',
    fontSize: px2dp(56),
    fontWeight: '800',
    letterSpacing: px2dp(4),
    color: 'rgba(255,255,255,0.8)',
  },
});
