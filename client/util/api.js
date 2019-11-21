function request(method, url, data) {
  return axios({
    method: method,
    url: `/api/${url}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    data: data
  });
}

const API = {
  get: (url = '', data = {}) => {
    return request('get', url, data);
  },

  post: (url = '', data = {}) => {
    return request('post', url, data);
  },

  put: (url = '', data = {}) => {
    return request('put', url, data);
  },

  delete: (url = '', data = {}) => {
    return request('delete', url, data);
  }
};
