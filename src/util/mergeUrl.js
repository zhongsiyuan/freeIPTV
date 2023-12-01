import { SERVER_ROOT } from '@/constant';

/**
 * mergeUrl
 * @param url
 * @return {string}
 */
export default (url) => {
  return `${SERVER_ROOT}/${url}`;
};
