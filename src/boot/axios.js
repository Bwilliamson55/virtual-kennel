import { boot } from "quasar/wrappers";
import axios from "axios";

const api = axios.create();
const n8n = axios.create({ baseURL: "https://n8n.weeumson.com" });

export default boot(({ app, api, n8n }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  app.config.globalProperties.$n8n = n8n;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { axios, api, n8n };
