import React, { Component } from 'react';
import { ActivityIndicator, Text, ToastAndroid, View } from 'react-native';
import Video from 'react-native-video';
import { MobxContext } from '@/store';
import { debounce, mergeUrl } from '@/util';
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
  static contextType = MobxContext;

  constructor(props) {
    super(props);

    this.state = {
      status: STATUS.IN_PLAY,
      menuFocusAt: MENU_FOCUS_AT.CHANNEL,
      infoVisible: false,
      inputNum: '',
      loading: true,
      error: null,
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

  get menuChannels() {
    const { channels, favorites, activeCategory } = this.context.player;

    let map = new Map();

    switch (activeCategory) {
      case CATEGORY.FAVOURITE:
        map = favorites;
        break;
      case CATEGORY.RECENT:
        map = favorites;
        break;
      case CATEGORY.DEFAULT:
        map = channels;
        break;
      default:
        break;
    }

    return map;
  }

  async init() {
    await this.context.player.initChannels();

    const { channels, favorites, recent, activeChannel, activeCategory } = this.context.player;

    let menuFocusAt = MENU_FOCUS_AT.CATEGORY;

    if (!activeCategory) {
      let ret;

      if (favorites.size) {
        ret = CATEGORY.FAVOURITE;
      } else if (recent.size) {
        ret = CATEGORY.RECENT;
      } else {
        ret = CATEGORY.DEFAULT;
      }

      this.context.player.updateActiveCategory(ret);
    } else if (activeCategory === CATEGORY.FAVOURITE && favorites.size) {
      menuFocusAt = MENU_FOCUS_AT.CHANNEL;
    } else if (activeCategory === CATEGORY.RECENT && recent.size) {
      menuFocusAt = MENU_FOCUS_AT.CHANNEL;
    } else if (channels.size) {
      menuFocusAt = MENU_FOCUS_AT.CHANNEL;
    }

    if (!activeChannel) {
      let ret;

      if (activeCategory === CATEGORY.FAVOURITE) {
        ret = favorites.values().next().value;
      } else if (activeCategory === CATEGORY.RECENT) {
        ret = recent.values().next().value;
      } else {
        ret = channels.values().next().value;
      }

      this.context.player.updateActiveChannel(ret);
    }

    this.setState({ menuFocusAt });
  }

  changeChannel(eventType) {
    const { activeChannel, channels } = this.context.player;
    const { status, inputNum } = this.state;

    switch (eventType) {
      case EVENT_TYPE.DOWN:
        this.context.player.updateActiveChannel(channels.get(activeChannel.next));
        break;
      case EVENT_TYPE.UP:
        this.context.player.updateActiveChannel(channels.get(activeChannel.prev));
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
    const { activeCategory } = this.context.player;

    const idx = CATEGORY_OPT.findIndex((it) => it.value === activeCategory);
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
    let activeCategory;

    switch (eventType) {
      case EVENT_TYPE.DOWN:
        activeCategory = this.getCategory(ARROW.DOWN);
        break;
      case EVENT_TYPE.UP:
        activeCategory = this.getCategory(ARROW.UP);
        break;
      default:
        break;
    }

    this.context.player.updateActiveCategory(activeCategory);
  }

  onPress(eventType) {
    console.log(eventType, this.state, 'eventType');

    const { channels, activeChannel } = this.context.player;

    const { status, menuFocusAt } = this.state;

    if (!channels.size) {
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
            menuFocusAt: this.menuChannels.size ? MENU_FOCUS_AT.CHANNEL : MENU_FOCUS_AT.CATEGORY,
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
          if (menuFocusAt === MENU_FOCUS_AT.CATEGORY && this.menuChannels.size) {
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
            if (this.menuChannels.size) {
              this.setState({ menuFocusAt: MENU_FOCUS_AT.CHANNEL });
            }
          } else {
            const channel = channels.get(activeChannel.channelNum);
            this.context.player.updateChannel({ ...channel, favorite: !channel.favorite });
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
    const { channels } = this.context.player;
    const { inputNum } = this.state;

    const activeChannel = channels.get(inputNum);

    if (activeChannel) {
      this.context.player.updateActiveChannel(activeChannel);
    }

    this.setState({ inputNum: '' }, this.showInfo);
  }

  render() {
    const { channels, activeChannel } = this.context.player;

    const { loading, error, status, infoVisible, menuFocusAt, inputNum } = this.state;
    return (
      <View style={style.player}>
        <View style={[style.inputNumWrap, inputNum ? null : style.hide]}>
          <Text style={style.inputNum}>{inputNum}</Text>
        </View>
        {status === STATUS.IN_MENU && (
          <Menu
            visible={status === STATUS.IN_MENU}
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
                <Text style={style.errInfo}>播放源：{channels.get(activeChannel)?.src}</Text>
              </View>
            </View>
          </View>
          <Video
            style={style.video}
            repeat
            resizeMode={'contain'}
            source={{ uri: mergeUrl(activeChannel?.src), type: 'm3u8' }}
            onError={(e) => this.setState({ loading: false, error: e.error })}
            onReadyForDisplay={() => this.setState({ loading: false, error: null })}
          />
        </View>
      </View>
    );
  }
}

export default Player;
