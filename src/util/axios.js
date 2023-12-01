import axios from 'axios';
import { SERVER_ROOT } from '@/constant';

const instance = axios.create({
  baseURL: SERVER_ROOT,
  timeout: 60 * 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (cfg) => cfg,
  (err) => Promise.reject(err),
);

instance.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);

export default instance;
