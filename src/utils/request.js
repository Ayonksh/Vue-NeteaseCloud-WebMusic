"use strict";

import axios from "axios";
import { AyNotification } from "@/base";

const ERROR_MSG = "请求错误";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const baseURL = process.env.VUE_APP_API_URL;

let config = {
  baseURL,
  timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // let token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.token = token;
    // }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response.data;
  },
  function (error) {
    const {
      data,
      config: { method },
    } = error.response;
    // Do something with response error
    AyNotification({
      duration: 4000,
      title: `[${data.code}] ${method.toUpperCase()}`,
      message: data.message || data.msg || ERROR_MSG,
    });
    return Promise.reject(error);
  }
);

export const request = _axios;
