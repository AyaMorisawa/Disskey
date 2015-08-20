import * as request from 'request-promise';
var config: { [key: string]: any } = require('../config.json');

request({
  url: 'https://api.misskey.xyz/sauth/get-authentication-session-key',
  method: 'GET',
  headers: {
    'sauth-app-key': config['sauthAppKey']
  }
}).then((value: any) => {
  console.log(value);
});