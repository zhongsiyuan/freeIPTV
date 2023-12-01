import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '@/util/axios';

// 频道列表
export const CHANNELS = 'channels';

// 服务器地址
export const SERVER = 'server';

// 按键映射表
export const KEYMAP = 'keymap';

// 收藏列表
export const FAVORITES = 'favorites';

// 最近列表
export const RECENT = 'recent';

// 当前活动频道
export const ACTIVE_CHANNEL = 'activeChannel';

// 当前活动分类
export const ACTIVE_CATEGORY = 'activeCategory';

export const storage = {
  cache: {},

  sync: {},

  /**
   * save
   * @param key
   * @param [id]
   * @param [value]
   * @return {Promise<void>}
   */
  async save(key, id, value) {
    if (arguments.length === 3) {
      if (!this.cache[key]) {
        this.cache[key] = {};
      }
      this.cache[key][id] = value;
    } else {
      this.cache[key] = value;
    }

    await AsyncStorage.setItem(key, JSON.stringify(this.cache[key]));
  },

  /**
   * load
   * @param key
   * @param id
   * @return {Promise<*>}
   */
  async load(key, id) {
    let ret = this.cache?.[key];

    if (!ret) {
      ret = await AsyncStorage.getItem(key);

      if (!ret) {
        if (arguments.length === 2) {
          this.cache[key] = {
            id: await this.sync[key]?.(id),
          };
        } else {
          this.cache[key] = await this.sync[key]?.();
        }

        if (this.cache[key]) {
          await AsyncStorage.setItem(key, JSON.stringify(this.cache[key]));
        }
      } else {
        this.cache[key] = JSON.parse(ret);
      }
    }

    if (arguments.length === 2) {
      return this.cache?.[key]?.[id];
    } else {
      return this.cache[key];
    }
  },
};

storage.sync = {
  async [CHANNELS]() {
    const { data } = await axios({ url: '/channels' });

    if (Array.isArray(data) && data.length) {
      return data;
    } else {
      return [];
    }
  },
};

export default storage;
