import { Dimensions } from 'react-native';
import { UI_WIDTH_PX } from '@/constant';

/**
 * px2dp
 * @return function(uiElementPx): *
 */
const px2dp = () => {
  let deviceWidthDp = Dimensions.get('window').width;

  Dimensions.addEventListener('change', ({ window }) => {
    deviceWidthDp = window.width;
  });

  return (uiElementPx) => {
    return (uiElementPx * deviceWidthDp) / UI_WIDTH_PX;
  };
};

export default px2dp();
