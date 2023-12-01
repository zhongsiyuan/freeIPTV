import React, { Component } from 'react';
import { ActivityIndicator, Text, ToastAndroid, View } from 'react-native';
import Video from 'react-native-video';
import { debounce, mergeUrl, storage, storageKey } from '@/util';
import {
  AUTO_HIDE_INFO_TIMEOUT,
  AUTO_HIDE_MENU_TIMEOUT,
  EVENT_TYPE,
  NUM_CHANGE_CHANNEL_MAX_DIGITS,
  NUM_CHANGE_CHANNEL_TIMEOUT,
  NUM_EVENT_TYPES,
} from '@/constant';
import ChannelInfo from './component/ChannelInfo';
import Menu from './component/Menu';
import { ARROW, CATEGORY, CATEGORY_OPT, MENU_FOCUS_AT, STATUS } from './constant';
import style from './player.style';

class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channels: [],
      activeChannel: null,
      activeCategory: CATEGORY.FAVOURITE,
      status: STATUS.IN_PLAY,
      menuFocusAt: MENU_FOCUS_AT.CHANNEL,
      infoVisible: false,
      inputNum: '',
      loading: true,
      error: null,
      favorites: {},
      recent: {},
      recentChannels: [],
    };

    this.delayHideInfo = debounce(this.hideInfo, AUTO_HIDE_INFO_TIMEOUT);

    this.delayHideMenu = debounce(this.hideMenu, AUTO_HIDE_MENU_TIMEOUT);

    this.delayGotoInputNum = debounce(this.gotoInputChannelNum, NUM_CHANGE_CHANNEL_TIMEOUT);

    this.pubOnPress = this.onPress.bind(this);
  }

  async componentDidMount() {
    this.props.onPressRef?.current?.add(this.pubOnPress);
    this.init();
  }

  componentWillUnmount() {
    this.props.onPressRef?.current?.delete(this.pubOnPress);
  }

  static async getChannels() {
    const data = await storage.load(storageKey.CHANNELS);
    let prev = data[data.length - 1];

    return data.map((channel, idx) => {
      Object.assign(channel, {
        ...channel,
        index: idx,
        prev,
        next: data.length === idx + 1 ? data[0] : data[idx + 1],
      });

      prev = channel;

      return channel;
    });
  }

  get channelToChannelNum() {
    const ret = new Map();

    this.state.channels.forEach((it) => {
      ret.set(it.channelNum.toString(), it);
    });

    return ret;
  }

  get favoriteSet() {
    const ret = new Set();

    Object.keys(this.state.favorites).forEach((id) => {
      if (this.state.favorites[id]) {
        ret.add(id.toString());
      }
    });

    return ret;
  }

  get recentSet() {
    const ret = new Set();

    Object.keys(this.state.recent).forEach((id) => {
      if (this.state.recent[id]) {
        ret.add(id.toString());
      }
    });

    return ret;
  }

  getMenuChannelsBySet(set) {
    const ret = [];
    set.forEach((id) => {
      if (this.channelToChannelNum.has(id)) {
        ret.push(this.channelToChannelNum.get(id));
      }
    });

    return ret;
  }

  get menuChannels() {
    let ret = [];

    switch (this.state.activeCategory) {
      case CATEGORY.FAVOURITE:
        ret = this.getMenuChannelsBySet(this.favoriteSet);
        break;
      case CATEGORY.RECENT:
        ret = this.getMenuChannelsBySet(this.recentSet);
        break;
      case CATEGORY.DEFAULT:
        ret = this.state.channels;
        break;
      default:
        break;
    }

    return ret;
  }

  async init() {
    const channels = await Player.getChannels();
    const favorites = await storage.load(storageKey.FAVORITES);
    const recent = await storage.load(storageKey.RECENT);
    let activeCategory = await storage.load(storageKey.ACTIVE_CATEGORY);
    let activeChannel = await storage.load(storageKey.ACTIVE_CHANNEL);

    let favZero;

    Object.keys(favorites || {}).forEach((id) => {
      if (favorites[id]) {
        favZero = channels.find((it) => it.channelNum.toString === id);
      }
    });

    let recentZero;

    Object.keys(recent || {}).forEach((id) => {
      if (recent[id]) {
        recentZero = channels.find((it) => it.channelNum.toString === id);
      }
    });

    let menuFocusAt = MENU_FOCUS_AT.CATEGORY;

    if (!activeCategory) {
      if (favZero) {
        activeCategory = CATEGORY.FAVOURITE;
      } else if (recentZero) {
        activeCategory = CATEGORY.RECENT;
      } else {
        activeCategory = CATEGORY.DEFAULT;
      }
    } else if (activeCategory === CATEGORY.FAVOURITE && favZero) {
      menuFocusAt = MENU_FOCUS_AT.CHANNEL;
    } else if (activeCategory === CATEGORY.RECENT && recentZero) {
      menuFocusAt = MENU_FOCUS_AT.CHANNEL;
    } else if (channels.length) {
      menuFocusAt = MENU_FOCUS_AT.CHANNEL;
    }

    if (!activeChannel) {
      if (activeCategory === CATEGORY.FAVOURITE) {
        activeChannel = favZero;
      } else if (activeCategory === CATEGORY.RECENT) {
        activeChannel = recentZero;
      } else {
        activeChannel = channels?.[0];
      }
    }

    this.setState({
      channels,
      activeCategory,
      menuFocusAt,
      activeChannel,
      favorites,
    });
  }

  changeChannel(eventType) {
    const { activeChannel, status, inputNum } = this.state;

    switch (eventType) {
      case EVENT_TYPE.DOWN:
        this.setState({ activeChannel: activeChannel.next });
        break;
      case EVENT_TYPE.UP:
        this.setState({ activeChannel: activeChannel.prev });
        break;
      case EVENT_TYPE.LEFT:
      case EVENT_TYPE.RIGHT:
        break;
      default:
        if (!NUM_EVENT_TYPES.includes(eventType)) {
          return;
        }

        if (inputNum.length >= NUM_CHANGE_CHANNEL_MAX_DIGITS) {
          this.gotoInputChannelNum();
        } else {
          this.setState({ inputNum: `${inputNum}${eventType}` }, this.delayGotoInputNum);
        }
        return;
    }

    if (status === STATUS.IN_PLAY) {
      this.showInfo();
    }
  }

  getCategory(arrow = ARROW.UP) {
    const idx = CATEGORY_OPT.findIndex((it) => it.value === this.state.activeCategory);
    let category;
    if (arrow === ARROW.UP) {
      category =
        idx === 0 ? CATEGORY_OPT[CATEGORY_OPT.length - 1].value : CATEGORY_OPT[idx - 1].value;
    } else {
      category =
        idx === CATEGORY_OPT.length - 1 ? CATEGORY_OPT[0].value : CATEGORY_OPT[idx + 1].value;
    }

    return category;
  }

  changeCategory(eventType) {
    switch (eventType) {
      case EVENT_TYPE.DOWN:
        this.setState({ activeCategory: this.getCategory(ARROW.DOWN) });
        break;
      case EVENT_TYPE.UP:
        this.setState({ activeCategory: this.getCategory(ARROW.UP) });
        break;
      default:
        break;
    }
  }

  onPress(eventType) {
    console.log(eventType, this.state, 'eventType');

    const { channels, status, menuFocusAt, activeChannel, favorites } = this.state;

    if (!channels.length) {
      ToastAndroid.showWithGravityAndOffset(
        '当前无播放列表！',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      return;
    }

    if (status === STATUS.IN_PLAY) {
      switch (eventType) {
        case EVENT_TYPE.SELECT:
          this.setState({
            menuFocusAt: this.menuChannels.length ? MENU_FOCUS_AT.CHANNEL : MENU_FOCUS_AT.CATEGORY,
          });
          this.showMenu();
          break;
        default:
          this.changeChannel(eventType);
          break;
      }
    } else if (status === STATUS.IN_MENU) {
      switch (eventType) {
        case EVENT_TYPE.SELECT:
          if (menuFocusAt === MENU_FOCUS_AT.CATEGORY && this.menuChannels.length) {
            this.setState({ menuFocusAt: MENU_FOCUS_AT.CHANNEL });
          } else {
            this.setState({ status: STATUS.IN_PLAY });
            this.showInfo();
          }
          return;
        case EVENT_TYPE.LEFT:
          this.setState({ menuFocusAt: MENU_FOCUS_AT.CATEGORY });
          break;
        case EVENT_TYPE.RIGHT:
          if (menuFocusAt === MENU_FOCUS_AT.CATEGORY) {
            if (this.menuChannels.length) {
              this.setState({ menuFocusAt: MENU_FOCUS_AT.CHANNEL });
            }
          } else {
            favorites[activeChannel.channelNum] = !favorites[activeChannel.channelNum];
            this.setState({ favorites });
            storage.save(
              storageKey.FAVORITES,
              activeChannel.channelNum,
              favorites[activeChannel.channelNum],
            );
          }
          break;
        default:
          if (menuFocusAt === MENU_FOCUS_AT.CATEGORY) {
            this.changeCategory(eventType);
          } else {
            this.changeChannel(eventType);
          }
          break;
      }
      this.showMenu();
    }
  }

  hideInfo() {
    this.setState({ infoVisible: false });
  }

  showInfo() {
    this.setState({ infoVisible: true }, this.delayHideInfo);
  }

  hideMenu() {
    this.setState({ status: STATUS.IN_PLAY }, this.showInfo);
  }

  showMenu() {
    this.setState({ status: STATUS.IN_MENU, infoVisible: false }, this.delayHideMenu);
  }

  gotoInputChannelNum() {
    const { channels, inputNum } = this.state;

    const activeChannel = channels.find((it) => `${it.channelNum}` === inputNum);

    this.setState(
      {
        activeChannel: activeChannel || this.state.activeChannel,
        inputNum: '',
      },
      this.showInfo,
    );
  }

  render() {
    const {
      loading,
      error,
      activeChannel,
      status,
      activeCategory,
      infoVisible,
      menuFocusAt,
      inputNum,
      favorites,
    } = this.state;

    return (
      <View style={style.player}>
        <View style={[style.inputNumWrap, inputNum ? null : style.hide]}>
          <Text style={style.inputNum}>{inputNum}</Text>
        </View>
        {status === STATUS.IN_MENU && (
          <Menu
            visible={status === STATUS.IN_MENU}
            favorites={favorites}
            channels={this.menuChannels}
            activeCategory={activeCategory}
            activeChannel={activeChannel}
            menuFocusAt={menuFocusAt}
          />
        )}
        {infoVisible && activeChannel && <ChannelInfo channel={activeChannel} />}
        <View style={style.videoWrap}>
          <View style={[style.videoMask, !loading && !error ? style.hide : null]}>
            <ActivityIndicator
              style={[style.loading, !loading ? style.hide : null]}
              size='large'
              color='#76adff'
            />
            <View style={[style.errorWrap, !error ? style.hide : null]}>
              <View>
                <Text style={style.errIcon}>:(</Text>
              </View>
              <View>
                <Text style={[style.errInfo, style.largeInfo]}>
                  载入频道时遇到一些错误，请联系技术人员
                </Text>
                <Text style={style.errInfo}>错误信息：{error?.errorString}</Text>
                <Text style={style.errInfo}>错误详情：{error?.errorException}</Text>
                <Text style={style.errInfo}>播放源：{activeChannel?.src}</Text>
              </View>
            </View>
          </View>
          <Video
            style={style.video}
            repeat
            resizeMode={'contain'}
            source={{ uri: mergeUrl(`${activeChannel?.src}123`), type: 'm3u8' }}
            onError={(e) => this.setState({ loading: false, error: e.error })}
            onReadyForDisplay={() => this.setState({ loading: false, error: null })}
          />
        </View>
      </View>
    );
  }
}

export default Player;
