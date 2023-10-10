import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'https://api.example.com' });

let outstanding = 0;
let complete = 0;
let currentValue = 0;

import { LoadingBar } from 'quasar';

function requestFinished<T>(result: T): T {
  outstanding--;
  complete++;
  const value = (complete / (complete + outstanding)) * 100;
  LoadingBar.increment(value - currentValue);
  if (outstanding == 0) {
    LoadingBar.stop();
  }
  return result;
}

axios.interceptors.request.use(
  (config) => {
    outstanding++;
    if (outstanding === 1) {
      LoadingBar.start(1);
      currentValue = 0;
    }
    return config;
  },
  (error) => Promise.reject(requestFinished(Promise.reject(error)))
);

axios.interceptors.response.use(requestFinished, (error) =>
  Promise.reject(requestFinished(error))
);

LoadingBar.setDefaults({
  color: 'primary',
  size: '15px',
  position: 'bottom',
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
