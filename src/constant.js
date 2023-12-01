export const SERVER_ROOT = 'http://172.20.10.2:3000';

/**
 * 按键类型
 * @type {{[string]: string}}
 * */
export const EVENT_TYPE = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  SELECT: 'select',
  RECORD: 'record',
  I: '1',
  II: '2',
  III: '3',
  IV: '4',
  V: '5',
  VI: '6',
  VII: '7',
  VIII: '8',
  IX: '9',
  X: '0',
};

/**
 * 数字按键类型
 * @type {(string)[]}
 */
export const NUM_EVENT_TYPES = [
  EVENT_TYPE.I,
  EVENT_TYPE.II,
  EVENT_TYPE.III,
  EVENT_TYPE.IV,
  EVENT_TYPE.V,
  EVENT_TYPE.VI,
  EVENT_TYPE.VII,
  EVENT_TYPE.VIII,
  EVENT_TYPE.IX,
  EVENT_TYPE.X,
];

/**
 * 自动隐藏菜单超时时间
 * @type {number}
 */
export const AUTO_HIDE_MENU_TIMEOUT = 5000;

/**
 * 自动隐藏频道信息超时时间
 * @type {number}
 */
export const AUTO_HIDE_INFO_TIMEOUT = 4000;

/**
 * 数字按键输入切换频道超时时间
 * @type {number}
 */
export const NUM_CHANGE_CHANNEL_TIMEOUT = 3000;

/**
 * 数字按键输入切换频道最大输入位数
 * @type {number}
 */
export const NUM_CHANGE_CHANNEL_MAX_DIGITS = 3;

/**
 * 设计图尺寸
 * @type {number}
 */
export const UI_WIDTH_PX = 1280;
