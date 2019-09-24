#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const RULES = [[/auth_token=[^?&]+/g, 'auth_token=REDACTED']];

function walk(dir, callback) {
  fs.readdir(dir, function(err, files) {
    if (err) throw err;
    files.forEach(function(file) {
      var filepath = path.join(dir, file);
      fs.stat(filepath, function(err, stats) {
        if (stats.isDirectory()) {
          walk(filepath, callback);
        } else if (stats.isFile()) {
          callback(filepath, stats);
        }
      });
    });
  });
}

function main() {
  walk(path.join(__dirname, '..', 'src', '__playbacks__'), async path => {
    const buffer = await readFile(path, {
      encoding: 'utf8',
    });
    let output = RULES.reduce(
      (out, rule) => out.replace(...rule),
      buffer.toString()
    );

    writeFile(path, output, {
      encoding: 'utf8',
    });
  });
}

main();
