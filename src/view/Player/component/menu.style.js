import { Dimensions, StyleSheet } from 'react-native';
import { px2dp } from '@/util';

export default StyleSheet.create({
  hide: {
    display: 'none',
  },
  light: {
    backgroundColor: 'rgba(255,255,255, 0.8)',
  },
  unlight: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  menu: {
    position: 'absolute',
    height: Dimensions.get('window').height,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.76)',
  },
  activeItem: {
    backgroundColor: 'rgba(80,74,255,0.3)',
  },
  unlightActive: {
    backgroundColor: 'rgba(80,74,255,0.2)',
  },
  category: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: px2dp(1),
    borderColor: '#ccc',
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: px2dp(32),
    paddingVertical: px2dp(16),
  },
  categoryIcon: {
    width: px2dp(48),
    height: px2dp(48),
  },
  categoryText: {
    paddingTop: px2dp(4),
    paddingRight: px2dp(2),
    fontSize: px2dp(18),
    fontWeight: '600',
    color: '#333',
  },
  channel: {
    height: '100%',
    minWidth: px2dp(416),
  },
  empty: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: px2dp(20),
    color: '#999',
  },
  channelItem: {
    flexDirection: 'row',
    paddingHorizontal: px2dp(12),
    paddingVertical: px2dp(12),
  },
  channelNo: {
    width: px2dp(56),
    padding: px2dp(2),
    marginTop: px2dp(2),
    fontSize: px2dp(18),
    textAlign: 'center',
    borderWidth: px2dp(1),
    borderRadius: px2dp(2),
    borderColor: '#999',
    color: '#666',
  },
  fav: {
    backgroundColor: '#FFBD42FF',
    borderColor: '#FFBD42FF',
    color: '#fff',
  },
  channelInfo: {
    marginLeft: px2dp(12),
    width: px2dp(320),
  },
  channelTitle: {
    fontSize: px2dp(22),
    lineHeight: px2dp(28),
    fontWeight: '800',
    color: '#666',
  },
  channelDesc: {
    fontSize: px2dp(18),
    lineHeight: px2dp(24),
    color: '#666',
  },
});
