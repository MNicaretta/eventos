const BASE_URL = 'http://127.0.0.1:8080/api';

function config(method, data, authorization) {
  const config = {};

  config.method = method;
  config.mode = 'no-cors';
  config.headers = {
    'Content-Type': 'application/json'
  };

  if (authorization) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  config.body = JSON.stringify(data);

  return config;
}

window.api = {
  get: async function(url = '', data = {}, authorization = true) {
    const response = await fetch(`${BASE_URL}/${url}`, config('GET', data, authorization));

    return await response.json();
  },

  post: async function(url = '', data = {}, authorization = true) {
    const response = await fetch(`${BASE_URL}/${url}`, config('POST', data, authorization));

    return await response.json();
  },

  put: async function(url = '', data = {}, authorization = true) {
    const response = await fetch(`${BASE_URL}/${url}`, config('PUT', data, authorization));

    return await response.json();
  },

  delete: async function(url = '', data = {}, authorization = true) {
    const response = await fetch(`${BASE_URL}/${url}`, config('DELETE', data, authorization));

    return await response.json();
  }
};
