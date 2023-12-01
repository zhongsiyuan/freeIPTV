import React, { useEffect, useRef } from 'react';
import { Image, Text, FlatList, View } from 'react-native';
import { px2dp } from '@/util';
import { CATEGORY_OPT, MENU_FOCUS_AT } from '../constant';
import style from './menu.style';

const CHANNEL_ITEM_HEIGHT = px2dp(76);

const CategoryItem = ({ menuFocusAt, category, active }) => {
  return (
    <View
      style={[
        style.categoryItem,
        active ? style.activeItem : null,
        active && menuFocusAt === MENU_FOCUS_AT.CHANNEL ? style.unlightActive : null,
      ]}
    >
      <Image
        style={style.categoryIcon}
        source={{ uri: category.icon }}
      />
      <Text style={style.categoryText}>{category.label}</Text>
    </View>
  );
};

const ChannelItem = ({ favorite, channel, active, onPress, menuFocusAt }) => {
  return (
    <View
      style={[
        style.channelItem,
        active ? style.activeItem : null,
        active && menuFocusAt === MENU_FOCUS_AT.CATEGORY ? style.unlightActive : null,
      ]}
      onPress={onPress}
    >
      <View>
        <Text style={[style.channelNo, favorite ? style.fav : null]}>{channel.channelNum}</Text>
      </View>
      <View style={style.channelInfo}>
        <Text style={style.channelTitle}>{channel.title}</Text>
        <Text
          style={style.channelDesc}
          numberOfLines={1}
        >
          {channel.title}
          {channel.title}
          {channel.title}
          {channel.title}
          {channel.title}
          {channel.title}
          {channel.title}
        </Text>
      </View>
    </View>
  );
};

export default ({ visible, favorites, channels, activeCategory, activeChannel, menuFocusAt }) => {
  const flatListRef = useRef();

  useEffect(() => {
    if (channels.length && activeChannel && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: activeChannel.index });
    }
  }, [activeChannel, channels.length]);

  return (
    <View style={[style.menu, visible ? null : style.hide]}>
      <View
        style={[
          style.category,
          menuFocusAt === MENU_FOCUS_AT.CATEGORY ? style.light : style.unlight,
        ]}
      >
        {CATEGORY_OPT.map((it) => (
          <CategoryItem
            menuFocusAt={menuFocusAt}
            key={it.value}
            active={it.value === activeCategory}
            category={it}
          />
        ))}
      </View>
      <View style={style.channel}>
        {channels.length ? (
          <FlatList
            ref={flatListRef}
            style={[
              style.channel,
              menuFocusAt === MENU_FOCUS_AT.CHANNEL ? style.light : style.unlight,
            ]}
            data={channels}
            renderItem={({ item }) => (
              <ChannelItem
                menuFocusAt={menuFocusAt}
                channel={item}
                favorite={favorites[item.channelNum]}
                active={activeChannel.channelNum === item.channelNum}
              />
            )}
            keyExtractor={(item) => item.channelNum}
            scrollEnabled={false}
            getItemLayout={(_, index) => ({
              length: CHANNEL_ITEM_HEIGHT,
              offset: CHANNEL_ITEM_HEIGHT * index,
              index,
            })}
          />
        ) : (
          <View style={style.empty}>
            <Text style={style.emptyText}>暂无数据</Text>
          </View>
        )}
      </View>
    </View>
  );
};
