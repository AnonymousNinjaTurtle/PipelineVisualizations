const submitPostRequest = (url, headers, data, jsonStringify = true, send_token = true) => {
  if (!url) {
    throw new Error('Cannot submit POST request. URL is null or undefined.');
  }

  const myHeaders = new Headers(headers);
  if (jsonStringify) {
    data = JSON.stringify(data);
  }

  return new Promise((resolve, reject) => {
    fetch(url, { method: 'POST', headers: myHeaders, body: data })
      .then(response => {
        if (!response.ok) {
          const json = response.json();
          if (json.then) {
            json.then(reject);
          } else {
            reject(new Error(`Error response. (${response.status}) ${response.statusText}`));
          }
        } else {
          const json = response.json();
          if (json.then) {
            json.then(resolve).catch(reject);
          } else {
            return resolve(json);
          }
        }
      })
      .catch(reject);
  });
};

export const executeProxyJSONRequest = (proxyCall, data) => {
  return submitPostRequest(proxyCall, { 'Content-Type': 'application/json' }, data);
};
