import axios from 'axios';
import { replaceCurlies, callApi } from '../utils/helper';
import { config } from '../config';

/**
 * Performs a batch operation on N http calls to a specific endpoint
 * Request's body should be of the form for GET / DELETE verbs:
 * {
   "endpoint":{
      "verb":HTTP_VERB,
      "url":"https://example.com/endpoint"
   }
  }
 * For POST / PUT / PATCH requests, you'll need to add also a payload property like so:
 {
   "endpoint":{
      "verb":"HTTP_VERB",
      "url":"https://example.com/endpoint"
   },
   "payload":[
      {
         "id":12,
         "body": jsonBody
      },
      {
         "id":20,
         "body": jsonBody
      }
   ]
  }
 *
 * @param req - The http request
 * @param res - The http response
 */
export function doBatchOperation(req, res) {
  const endpoint = req.body.endpoint;
  const endpointURL = endpoint.url;
  const endpointVerb = endpoint.verb;
  const payload = req.body.payload;


  const rateLimit = config().rateLimitUsersService;
  // Go over all the calls, and prepare an array
  // of batch calls to be then called simultaneously (well, not really, because of event loop, but close enough)
  // with rate limiting consideration, so we're basically sending a batch of rateLimit.number calls, then
  // waiting for rateLimit.period seconds, and sending the next batch, and do on
  let delay;
  const asyncCalls = payload.map((val, index) => {
    const url = val['id'] ? replaceCurlies(endpointURL, val['id']) : endpointURL;
    delay = Math.floor(index / rateLimit.number) * rateLimit.period * 1000;
    return callApi(url, endpointVerb.toLowerCase(), val['body'], delay);
  });

  let data = [];
  Promise.all(asyncCalls)
    .then(axios.spread(function() {
      // arguments will contain all the resolved calls from the async calls
      Array.from(arguments).forEach((response) => {
        data.push(response.data);
      });
      return res.json(data);
    })).catch((e) => {
    return res.status(e.status).json({ 'msg': 'Sorry, the data is not available at this moment, please try again' });
  });

}

