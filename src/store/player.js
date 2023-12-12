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
    return this.getMenuChannelsByActiveCategory(this.activeCategory);
  }

  @computed
  get menuChannelList() {
    return Player.getMenuChannelListByMenuChannels(this.menuChannels);
  }

  @computed
  get favorites() {
    return this.getCategoryChannels('favorite');
  }

  @computed
  get recent() {
    if (!this.channels.size) {
      return new Map();
    }

    const ret = new Map();

    return ret;
  }

  @action
  updateChannel({ channelNum, favorite }) {
    if (this.activeCategory !== CATEGORY.DEFAULT) {
      const nextChannelNum = this.menuChannels.get(channelNum).next;
      const nextMenuChannels = this.getMenuChannelsByActiveCategory(this.activeCategory, [
        channelNum,
      ]);
      const activeChannel = nextMenuChannels.get(nextChannelNum);

      if (activeChannel) {
        this.updateActiveChannel(activeChannel);
      }
    }

    const nativeChannel = this.channels.get(channelNum);
    this.channels.set(channelNum, { ...nativeChannel, favorite });
    AsyncStorage.setItem(STORAGE_KEY.CHANNELS, JSON.stringify(this.channels.toJSON()));
  }

  @action
  updateActiveChannel(activeChannel) {
    this.activeChannel = activeChannel;
  }

  @action
  updateActiveCategory(activeCategory) {
    this.activeCategory = activeCategory;

    const menuChannels = this.getMenuChannelsByActiveCategory(activeCategory);
    let sameAc = menuChannels.get(this.activeChannel?.channelNum);
    if (!sameAc) {
      [sameAc] = Player.getMenuChannelListByMenuChannels(menuChannels);
    }
    if (sameAc) {
      this.updateActiveChannel(sameAc);
    }
  }

  @action
  async initChannels() {
    let channels = observable.map();
    // await AsyncStorage.clear();
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
          next: data[data.length - 1 === idx ? 0 : idx + 1].channelNum.toString(),
          channelNum: channel.channelNum.toString(),
        });

        prev = channel.channelNum.toString();

        channels.set(channel.channelNum.toString(), channel);
      });

      await AsyncStorage.setItem(STORAGE_KEY.CHANNELS, JSON.stringify(channels.toJSON()));
    }

    this.channels.replace(channels);
  }

  /**
   * @private
   * getCategoryChannels
   * @param categoryType
   * @param ignoreIds
   * @return {Map<any, any>}
   */
  getCategoryChannels(categoryType, ignoreIds = []) {
    const arr = [];
    const ret = new Map();
    this.channels.forEach((channel) => {
      if (channel[categoryType] && !ignoreIds.includes(channel.channelNum)) {
        arr.push(channel);
      }
    });

    if (!arr.length) {
      return new Map();
    }

    let prev = arr[arr.length - 1].channelNum;
    arr.forEach((it, idx) => {
      ret.set(it.channelNum, {
        ...it,
        prev,
        index: idx,
        next: arr[idx === arr.length - 1 ? 0 : idx + 1].channelNum,
      });

      prev = it.channelNum;
    });

    return ret;
  }

  /**
   * @private
   * getMenuChannelsByActiveCategory
   * @return {Map<any, any>}
   */
  getMenuChannelsByActiveCategory(activeCategory, ignoreIds = []) {
    let ret;

    switch (activeCategory) {
      case CATEGORY.FAVOURITE:
        ret = this.getCategoryChannels('favorite', ignoreIds);
        break;
      case CATEGORY.RECENT:
        ret = this.getCategoryChannels('recent', ignoreIds);
        break;
      case CATEGORY.DEFAULT:
        ret = this.channels;
        break;
      default:
        break;
    }

    return ret;
  }

  /**
   * @private
   * getMenuChannelListByMenuChannels
   * @param menuChannels
   * @return {*[]}
   */
  static getMenuChannelListByMenuChannels(menuChannels) {
    const ret = [];

    menuChannels.forEach((it) => {
      ret.push(it);
    });

    return ret;
  }
}

export default new Player();
