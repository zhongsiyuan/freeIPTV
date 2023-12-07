import { observable, action, computed } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '@/util/axios';
import { CATEGORY } from '@/view/Player/constant';

const STORAGE_KEY = {
  CHANNELS: 'channels',
};

class Player {
  @observable
  channels = observable.map();

  @observable
  activeChannel = null;

  @observable
  activeCategory = null;

  @computed
  get menuChannels() {
    let ret;

    switch (this.activeCategory) {
      case CATEGORY.FAVOURITE:
        ret = this.favorites;
        break;
      case CATEGORY.RECENT:
        ret = this.recent;
        break;
      case CATEGORY.DEFAULT:
        ret = this.channels;
        break;
      default:
        break;
    }

    return ret;
  }

  @computed
  get menuChannelList() {
    const ret = [];

    this.menuChannels.forEach((it) => {
      ret.push(it);
    });

    return ret;
  }

  @computed
  get favorites() {
    const ret = new Map();
    this.channels.forEach((channel) => {
      if (channel.favorite) {
        ret.set(channel.channelNum, channel);
      }
    });

    return ret;
  }

  @computed
  get recent() {
    const ret = new Map();

    return ret;
  }

  @action
  updateChannel(channel) {
    this.channels.set(channel.channelNum, channel);
    // this.channels.merge([[channel.channelNum, { ...channel }]]);
    AsyncStorage.setItem(STORAGE_KEY.CHANNELS, JSON.stringify(this.channels.toJSON()));
  }

  @action
  updateActiveChannel(activeChannel) {
    this.activeChannel = activeChannel;
  }

  @action
  updateActiveCategory(activeCategory) {
    this.activeCategory = activeCategory;
  }

  @action
  async initChannels() {
    let channels = observable.map();
    await AsyncStorage.clear();
    const ret = await AsyncStorage.getItem(STORAGE_KEY.CHANNELS);
    if (ret) {
      channels = new Map(JSON.parse(ret));
    } else {
      const { data } = await axios({ url: '/channels' });
      let prev = data[data.length - 1].channelNum.toString();
      data.forEach((channel, idx) => {
        Object.assign(channel, {
          ...channel,
          index: idx,
          prev,
          next: (data.length === idx + 1 ? data[0] : data[idx + 1]).channelNum.toString(),
          channelNum: channel.channelNum.toString(),
        });

        prev = channel.channelNum.toString();

        channels.set(channel.channelNum.toString(), channel);
      });

      await AsyncStorage.setItem(STORAGE_KEY.CHANNELS, JSON.stringify(channels.toJSON()));
    }

    this.channels.replace(channels);
  }
}

export default new Player();
