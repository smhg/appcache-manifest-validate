#!/usr/bin/env node
'use strict';

const readline = require('readline');
const url = require('url');
const http = {
  'http:': require('http'),
  'https:': require('https')
};

const hasSlash = new RegExp('/');

const manifest = process.argv[2];

let {protocol} = url.parse(manifest);

http[protocol].get(manifest, response => {
  const rl = readline.createInterface({
    input: response
  });

  rl.on('line', line => {
    if (hasSlash.test(line)) {
      const validate = url.resolve(manifest, line);
      const {protocol} = url.parse(validate);

      http[protocol].get(validate, response => {
        if (response.statusCode >= 300) {
          console.error(response.statusCode, validate);
        } else {
          console.log(response.statusCode, validate);
        }
      });
    }
  });
});