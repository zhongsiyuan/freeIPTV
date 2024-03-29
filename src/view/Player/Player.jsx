import React, { Component, createRef } from 'react';
import { ActivityIndicator, Text, ToastAndroid, View } from 'react-native';
import { observer } from 'mobx-react';
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

@observer
class Player extends Component {
  static contextType = MobxContext;

  changeSetting = createRef();

  constructor(props) {
    super(props);

    this.state = {
      status: STATUS.IN_PLAY,
      menuFocusAt: MENU_FOCUS_AT.SUB,
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

  async init() {
    await this.context.initChannels();

    const { channels, favorites, activeChannel, activeCategory } = this.context;

    let menuFocusAt = MENU_FOCUS_AT.CATEGORY;

    if (!activeCategory) {
      let ret;

      if (favorites.size) {
        ret = CATEGORY.FAVOURITE;
      } else {
        ret = CATEGORY.DEFAULT;
      }

      this.context.updateActiveCategory(ret);
    } else if (activeCategory === CATEGORY.FAVOURITE && favorites.size) {
      menuFocusAt = MENU_FOCUS_AT.SUB;
    } else if (channels.size) {
      menuFocusAt = MENU_FOCUS_AT.SUB;
    }

    if (!activeChannel) {
      let ret;

      if (activeCategory === CATEGORY.FAVOURITE) {
        ret = favorites.values().next().value;
      } else {
        ret = channels.values().next().value;
      }

      this.context.updateActiveChannel(ret);
    }

    this.setState({ menuFocusAt });
  }

  changeChannel(eventType) {
    const { activeChannel, channels, menuChannels } = this.context;
    const { status, inputNum } = this.state;

    if (status === STATUS.IN_PLAY) {
      switch (eventType) {
        case EVENT_TYPE.DOWN:
          this.context.updateActiveChannel(channels.get(activeChannel.next));
          break;
        case EVENT_TYPE.UP:
          this.context.updateActiveChannel(channels.get(activeChannel.prev));
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

      this.showInfo();
    } else {
      let ret;

      switch (eventType) {
        case EVENT_TYPE.DOWN:
          ret = menuChannels.get(activeChannel.next);
          break;
        case EVENT_TYPE.UP:
          ret = menuChannels.get(activeChannel.prev);
          break;
        default:
          ret = menuChannels.entries().next().value;
          break;
      }

      this.context.updateActiveChannel(ret);
    }
  }

  getCategory(arrow = ARROW.UP) {
    const { activeCategory } = this.context;

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

    this.context.updateActiveCategory(activeCategory);
  }

  onPress(eventType) {
    console.log(eventType, this.state, 'eventType');

    const { activeCategory, channels, activeChannel, menuChannels } = this.context;

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
            menuFocusAt: menuChannels.size ? MENU_FOCUS_AT.SUB : MENU_FOCUS_AT.CATEGORY,
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
          if (menuFocusAt === MENU_FOCUS_AT.CATEGORY && menuChannels.size) {
            this.setState({ menuFocusAt: MENU_FOCUS_AT.SUB });
          } else if (activeCategory === CATEGORY.SETTING) {
            this.setState({ menuFocusAt: MENU_FOCUS_AT.SUB });
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
            if (menuChannels.size || activeCategory === CATEGORY.SETTING) {
              this.setState({ menuFocusAt: MENU_FOCUS_AT.SUB });
            }
          } else {
            const channel = menuChannels.get(activeChannel.channelNum);
            if (channel) {
              this.context.updateChannel({ ...channel, favorite: !channel.favorite });
            }
          }
          break;
        default:
          if (menuFocusAt === MENU_FOCUS_AT.CATEGORY) {
            this.changeCategory(eventType);
          } else if (activeCategory === CATEGORY.SETTING) {
            this.changeSetting.current?.(eventType);
          } else if (menuChannels.size) {
            this.changeChannel(eventType);
          } else {
            this.setState({ menuFocusAt: MENU_FOCUS_AT.CATEGORY });
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
    const { channels } = this.context;
    const { inputNum } = this.state;

    const activeChannel = channels.get(inputNum);

    if (activeChannel) {
      this.context.updateActiveChannel(activeChannel);
    }

    this.setState({ inputNum: '' }, this.showInfo);
  }

  render() {
    const { channels, activeChannel } = this.context;

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
            changeSetting={this.changeSetting}
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
            source={{ uri: `${mergeUrl(activeChannel?.src)}123`, type: 'm3u8' }}
            onError={(e) => this.setState({ loading: false, error: e.error })}
            onReadyForDisplay={() => this.setState({ loading: false, error: null })}
          />
        </View>
      </View>
    );
  }
}

export default Player;
