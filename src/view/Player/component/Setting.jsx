import React, { useCallback, useEffect, useState } from 'react';
import { Button, View, Switch, Text, ToastAndroid } from 'react-native';
import { observer } from 'mobx-react';
import { showFilePicker } from 'react-native-file-picker';
import { readFile } from 'react-native-fs';
import { useStore } from '@/store';
import { MENU_FOCUS_AT } from '@/view/Player/constant';
import { EVENT_TYPE } from '@/constant';
import style from './menu.style';

const SETTING_TYPE = {
  REMOTE_SW: 0,
  AUTO_UPDATE: 1,
  SELECT_FILE: 2,
};

const settingInfoToType = new Map();

const TYPES = Object.values(SETTING_TYPE);
TYPES.forEach((v, i) => {
  const n = i === TYPES.length - 1 ? TYPES[0] : TYPES[i + 1];
  const p = i !== 0 ? TYPES[i - 1] : TYPES[TYPES.length - 1];

  settingInfoToType.set(v, { n, p });
});

export default observer(({ menuFocusAt, changeSetting }) => {
  const store = useStore();

  const [active, setActive] = useState(SETTING_TYPE.REMOTE_SW);

  const changeActiveSetting = useCallback(
    (eventType) => {
      switch (eventType) {
        case EVENT_TYPE.DOWN:
          setActive(settingInfoToType.get(active).n);
          break;
        case EVENT_TYPE.UP:
          setActive(settingInfoToType.get(active).p);
          break;
        default:
          break;
      }
    },
    [active],
  );

  const onError = useCallback(() => {
    ToastAndroid.showWithGravityAndOffset(
      '文件读取失败！',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }, []);

  const onPickFile = useCallback(() => {
    showFilePicker(
      {
        title: '请选择播放列表',
        chooseFileButtonTitle: '选择文件',
      },
      async (res) => {
        if (res.error) {
          onError();
          return;
        }

        try {
          const data = await readFile(res.path);
          await store.updateChannels(JSON.parse(data));
        } catch (e) {
          onError();
        }
      },
    );
  }, [onError, store]);

  const onUpdate = useCallback(() => {
    // TODO: refresh remote data;
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    changeSetting.current = changeActiveSetting;
  }, [changeActiveSetting, changeSetting]);

  return (
    <View>
      <View
        style={[
          style.activeItem,
          active === SETTING_TYPE.REMOTE_SW ? style.activeItem : null,
          active === SETTING_TYPE.REMOTE_SW && menuFocusAt === MENU_FOCUS_AT.SUB
            ? style.unlightActive
            : null,
        ]}
      >
        <Text>{store.useRemote ? 'true' : 'false'} 使用服务器更新</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={store.useRemote ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={() => store.updateUseRemote()}
          value={store.useRemote}
        />
      </View>
      {store.useRemote ? (
        <View>
          <View
            style={[
              style.activeItem,
              active === SETTING_TYPE.AUTO_UPDATE ? style.activeItem : null,
              active === SETTING_TYPE.AUTO_UPDATE && menuFocusAt === MENU_FOCUS_AT.SUB
                ? style.unlightActive
                : null,
            ]}
          >
            <Text>每次启动后自动更新</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={store.autoUpdate ? '#f5dd4b' : '#f4f3f4'}
              onValueChange={store.updateRemoteUrl}
              value={store.autoUpdate}
            />
          </View>
          <View
            style={[
              style.activeItem,
              active === SETTING_TYPE.AUTO_UPDATE ? style.activeItem : null,
              active === SETTING_TYPE.AUTO_UPDATE && menuFocusAt === MENU_FOCUS_AT.SUB
                ? style.unlightActive
                : null,
            ]}
          >
            <Button
              onPress={onUpdate}
              title='更新'
              color='#841584'
            />
          </View>
        </View>
      ) : (
        <View
          style={[
            style.activeItem,
            active === SETTING_TYPE.SELECT_FILE ? style.activeItem : null,
            active === SETTING_TYPE.SELECT_FILE && menuFocusAt === MENU_FOCUS_AT.SUB
              ? style.unlightActive
              : null,
          ]}
        >
          <Button
            onPress={onPickFile}
            title='选择文件'
            color='#841584'
          />
        </View>
      )}
    </View>
  );
});
