#!/usr/bin/env node
import fs from 'fs';
import { Command } from 'commander/esm.mjs';
import { PAGES_DIR } from './lib.js';

const program = new Command();

/* 
  possibl commands
  npm run cli generate-page about
  npm run cli generate-page --help
*/

const templates = {
  template: name => (`---
layout: base.njk
pagename: ${name}
permalink: "build/${name}/index.html"
permalinkBypassOutputDir: true
nickname: ${name}
---
<div class="${name}"> ${name} page </div>`),
  css: () => '',
  json: () => '{}',
  js: ()=> '',
}

function trimData(data) {
  return data.trim();
}

function getFilesObject(name){
  return {
    template: `${name}.njk`,
    css: `${name}-sync.css`,
    js: `${name}-module.js`,
    json: `${name}.json`,
  };
}

const fileExists = path => file => fs.existsSync(`${path}/${file}`);

const writeToPath = path => (file, content) => {
  const filePath = `${path}/${file}`;
  if (!fs.existsSync(path)){
    fs.mkdirSync(path, { recursive: true });
  }
  fs.writeFile(filePath, content, err => {
    if (err) throw err;
    console.log("Created file: ", filePath);
    return true;
  });
};

function createFiles(path, name) {
  const files = getFilesObject(name);
  const writeFile = writeToPath(path);
  const toFileMissingBool = file => !fileExists(path)(file);
  const checkAllMissing = (acc, cur) => acc && cur;

  const noneExist = Object.values(files)
    .map(toFileMissingBool)
    .reduce(checkAllMissing);

  if (noneExist) {
    console.log(`Detected new file: ${name}, ${path}`);
    Object.entries(files).forEach(([type, fileName]) => {
      writeFile(fileName, trimData(templates[type](name)));
    });
  }else{
    console.log(`File already exists: ${name}, ${path}`);
  }
}

program.name('create skipper site');
program.version('0.0.2');
program
  .command('generate-page [name]')
  .description('generates a page and required assets')
  //.option('-n,--name <page_name>', 'page name')
  .action((name) => {
    const parsedName = name.includes('/') ? name.split('/')[1] : name;
    if(name && typeof name == 'string'){
      createFiles(PAGES_DIR.pathname + `/${name}`, parsedName);
    }
  });

  
program.parse();

