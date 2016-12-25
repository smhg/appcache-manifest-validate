#!/usr/bin/env node
'use strict';

const readline = require('readline');
const url = require('url');
const http = {
  'http:': require('http'),
  'https:': require('https')
};

const headerCheck = new RegExp('^([A-Z]+):$');
const commentCheck = new RegExp('^#');

const manifest = process.argv[2];
const {protocol} = url.parse(manifest);

http[protocol].get(manifest, res => {
  const rl = readline.createInterface({
    input: res
  });

  let currentSection;
  let title = '';

  rl.on('line', line => {
    line = line.trim();

    if (line.length === 0 || commentCheck.test(line)) {
      // ignore empty lines and comments
      return;
    }

    if (title.length === 0) {
      title = line;

      if (title !== 'CACHE MANIFEST') {
        console.error(`Cache manifest does not start with 'CACHE MANIFEST'.`);
      }

      return;
    }

    if (title.length > 0 && title !== 'CACHE MANIFEST') {
      // missing 'CACHE MANIFEST' title, ignore everything
      return;
    }

    if (headerCheck.test(line)) {
      [, currentSection] = headerCheck.exec(line);
      return;
    }

    if (!currentSection || currentSection === 'CACHE') {
      const resource = url.resolve(manifest, line);
      const {protocol} = url.parse(resource);

      http[protocol].get(resource, response => {
        if (response.statusCode >= 300) {
          console.error(response.statusCode, resource);
        } else {
          console.log(response.statusCode, resource);
        }
      });
    }
  });
});