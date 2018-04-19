import axios from 'axios';

export const hasCurlies = (str) => {
  const rxp = /{([^}]+)}/g;
  return rxp.test(str);
};

export const replaceCurlies = (str, value) => {
  const rxp = /{([^}]+)}/g;
  return str.replace(rxp, value);
};

export const callApi = (apiEndpoint, method = 'get', bodyData, delay = 0, retries = 1) => {
  const invokeObj = {
    method: method,
    url: apiEndpoint
  };

  if (bodyData) {
    invokeObj.data = bodyData;
  }
  console.log(retries);
  return new Promise((resolve, reject) => {
    function callWithRetry() {
      axios(invokeObj).then((resp) => {
        resolve(resp);
      }).catch((error) => {

        if (retries > 0) {
          console.log(`retrying for ${method.toUpperCase()} ${apiEndpoint} ...`);
          resolve(callApi(apiEndpoint, method, bodyData, 0, retries-1));
        } else {
          console.error(`${method.toUpperCase()} ${apiEndpoint} errored with status ${error.response.status}, with the message: ${error.response.statusText}`);
          reject(error.response);
        }
      })
    }

    if (delay > 0) {
      console.log(`The call ${method.toUpperCase()} ${apiEndpoint} will be delayed for ${delay} milliseconds`);
    }

    setTimeout(callWithRetry, delay);
  });
};