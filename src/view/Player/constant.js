import { def, fav, recent } from '@/assets/icon';

/**
 * 播放状态
 * @type {{IN_MENU: number, IN_PLAY: number}}
 */
export const STATUS = {
  IN_PLAY: 0,
  IN_MENU: 1,
};

/**
 * 菜单一级类别
 * @type {{RECENT: number, FAVOURITE: number, DEFAULT: number}}
 */
export const CATEGORY = {
  FAVOURITE: 0,
  RECENT: 1,
  DEFAULT: 2,
};

/**
 * 菜单选项
 * @type {{icon: string, label: string, value: valueOf<CATEGORY>}[]}
 * */
export const CATEGORY_OPT = [
  { value: CATEGORY.FAVOURITE, label: '收藏', icon: fav },
  { value: CATEGORY.RECENT, label: '最近', icon: recent },
  { value: CATEGORY.DEFAULT, label: '默认', icon: def },
];

/**
 * 当前激活菜单类别
 * @type {{CHANNEL: number, CATEGORY: number}}
 */
export const MENU_FOCUS_AT = {
  CATEGORY: 0,
  CHANNEL: 1,
};

/**
 * 方向
 * @type {{DOWN: number, UP: number}}
 */
export const ARROW = {
  UP: 0,
  DOWN: 1,
};
