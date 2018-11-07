import isFunction from 'lodash/isFunction';
import qs from 'query-string';

const { API_URL } = process.env;
const { CW_API_URL } = process.env;

function handleResponse(d) {
  if (d.status >= 200 && d.status <= 300) {
    const data = isFunction(d.json) ? d.json() : d;
    data.json = () => data;
    return data;
  }
  throw new Error(d.statusText);
}

class API {
  constructor(baseUrl, config = {}) {
    this.config = { ...config };
    this.baseURL = baseUrl;
  }

  get(endpoint, params) {
    const url = `${this.baseURL}/${endpoint}${params
      ? `?${qs.stringify(params)}`
      : ''}`;
    return fetch(url, this.config).then(handleResponse);
  }

  post(endpoint, params) {
    const url = `${this.baseURL}/${endpoint}`;
    return fetch(url, {
      ...this.config,
      method: 'POST',
      body: JSON.stringify(params)
    }).then(handleResponse);
  }

  patch(endpoint, params) {
    const url = `${this.baseURL}/${endpoint}`;
    return fetch(url, {
      ...this.config,
      method: 'PATCH',
      body: JSON.stringify(params)
    }).then(handleResponse);
  }

  delete(endpoint) {
    const url = `${this.baseURL}/${endpoint}`;
    return fetch(url, { ...this.config, method: 'DELETE' }).then(
      handleResponse
    );
  }
}

export const CWAPI = new API(CW_API_URL);
export const INDOAPI = new API(API_URL);
