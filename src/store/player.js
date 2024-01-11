import { observable, action, computed, makeAutoObservable } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '@/util/axios';
import { CATEGORY } from '@/view/Player/constant';

const STORAGE_KEY = {
  USE_REMOTE: 'useRemote',
  REMOTE_URL: 'remoteUrl',
  AUTO_UPDATE: 'autoUpdate',
  ACTIVE_CHANNEL: 'activeChannel',
  CHANNELS: 'channels',
};

class Player {
  constructor() {
    makeAutoObservable(this);
  }

  @observable
  useRemote = false;

  @observable
  remoteUrl = '';

  @observable
  autoUpdate = false;

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

  @action
  updateUseRemote() {
    console.log(this.useRemote, 'ut');
    this.useRemote = !this.useRemote;
    console.log(this.useRemote, 'ut2');
    AsyncStorage.setItem(STORAGE_KEY.USE_REMOTE, this.useRemote ? '1' : '0');
  }

  @action
  updateRemoteUrl() {
    this.remoteUrl = !this.remoteUrl;
    AsyncStorage.setItem(STORAGE_KEY.REMOTE_URL, this.remoteUrl ? '1' : '0');
  }

  @action
  updateAutoUpdate() {
    this.autoUpdate = !this.autoUpdate;
    AsyncStorage.setItem(STORAGE_KEY.AUTO_UPDATE, this.autoUpdate ? '1' : '0');
  }

  @action
  async updateChannels(data) {
    const channels = observable.map();

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

    this.channels.replace(channels);
    await AsyncStorage.setItem(STORAGE_KEY.CHANNELS, JSON.stringify(channels.toJSON()));
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
      } else {
        // this.activeCategory = CATEGORY
      }
    }

    const nativeChannel = this.channels.get(channelNum);
    this.channels.set(channelNum, { ...nativeChannel, favorite });
    AsyncStorage.setItem(STORAGE_KEY.CHANNELS, JSON.stringify(this.channels.toJSON()));
  }

  @action
  updateActiveChannel(activeChannel) {
    this.activeChannel = activeChannel;
    AsyncStorage.setItem(STORAGE_KEY.ACTIVE_CHANNEL, JSON.stringify(activeChannel));
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
    if (this.useRemote && this.autoUpdate) {
      const { data } = await axios({ url: this.remoteUrl });
      await this.updateChannels(data);
    } else {
      const ret = await AsyncStorage.getItem(STORAGE_KEY.CHANNELS);
      if (ret) {
        this.channels.replace(new Map(JSON.parse(ret)));
      }
    }

    this.useRemote = (await AsyncStorage.getItem(STORAGE_KEY.USE_REMOTE)) === '1';
    this.remoteUrl = await AsyncStorage.getItem(STORAGE_KEY.REMOTE_URL);
    this.autoUpdate = (await AsyncStorage.getItem(STORAGE_KEY.AUTO_UPDATE)) === '1';
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
    let ret = new Map();

    switch (activeCategory) {
      case CATEGORY.FAVOURITE:
        ret = this.getCategoryChannels('favorite', ignoreIds);
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
