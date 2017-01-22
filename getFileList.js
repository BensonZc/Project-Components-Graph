'use strict';
const fs = require("fs");
const rd = require('rd');
const path = require("path");
const config = require('./config.json')
const readline = require("linebyline");

const filePath = path.resolve();
const remotePath = config.remotePath
const regRule = config.regRule
  
let data = {};
data.nodes = [];
data.links = [];

let fileObject = {}
let value = 1;

rd.eachFileFilterSync(remotePath, /^(?!.*(node_modules|\.git)).*\.vue$/, function (file, stat) {
  let rl = readline(file);
  rl.on('line', function(line, lineCount, byteCount) {
    if(/import/.test(line) && !/important/.test(line)){
      let array = file.match('.*(/.*\.vue$)');
      let name = array[array.length - 1].slice(1,-4); //捕获 vue
      for(let i = 0;i < line.length;i++){
        if(line[i] == '"'){
          line = line.substr(0,i) + "'" + line.substr(i + 1);
        }
      }
      let importWidget = {};
      
      let tempFile = file.match('(.*)/.*\..*$')  //不带后缀的路径 + 文件名
      let ra_locate = tempFile[tempFile.length - 1]
      
      let tempLocate = line.match('.*(\'.*\')'); // 不带后缀的路径 + 文件名
      let iLocate = tempLocate[tempLocate.length - 1].slice(1,-1);

      for(let regName in regRule){
        let pattern1 = new RegExp( `^${regName}\/`, "g"); 
        let pattern2 = new RegExp( `(^${regName}\/)(.*)`, "g"); 
        if(pattern1.test(iLocate)){
          pattern1.lastIndex = 0;
          iLocate = iLocate.replace(pattern2, regRule[regName]+'$2')
        }
      }

      if(/(\.\.\/)+/.test(iLocate)){ // ../ 格式文件路径
        let deep = iLocate.match(/\.\.\//g).length;
        let positions = [];
        let pos = ra_locate.indexOf('/');
        while (pos > -1) {
          positions.push(pos);
          pos = ra_locate.indexOf('/', pos + 1);
        }
        let preStr = ra_locate.slice(0, positions[positions.length - deep] + 1)
        iLocate = iLocate.replace(/(.*\.\.\/)+(\w.*)/,preStr+'$2')
      }else if(/(\.\/)+/.test(iLocate)){ // ./ 格式文件路径
        let positions = [];
        let pos = ra_locate.indexOf('/');
        
        while (pos > -1) {
          positions.push(pos);
          pos = ra_locate.indexOf('/', pos + 1);
        }

        iLocate = iLocate.replace(/(\.\/)(\w.*)/,ra_locate+'/$2')
      }

      if(/\..*$/.test(iLocate)){
        iLocate = iLocate.replace(/(.*)(\..*$)/,'$1');
      }
      
      if(!fileObject[file]){
        fileObject[file] = {};
        fileObject[file].name = ra_locate + '/' + name;
        fileObject[file].r_name = name;
        fileObject[file].category = 0;
        fileObject[file].value = value;
        data.nodes.push(fileObject[file]);
        value++;
      }
      
      let directs = {}
      directs.source = ra_locate + '/' + name;
      directs.target = iLocate;
      data.links.push(directs);
      
      writeFile('export const project =' + JSON.stringify(data))
    }else if(!/import/.test(line) && !/important/.test(line) && lineCount == 1){
      let array = file.match('.*(/.*\.vue$)');
      let name = array[array.length - 1].slice(1,-4); //捕获 vue
      
      let tempFile = file.match('(.*)/.*\..*$')  //不带后缀的路径 + 文件名
      let ra_locate = tempFile[tempFile.length - 1]
      if(!fileObject[file]){
        fileObject[file] = {};
        fileObject[file].name = ra_locate + '/' + name;
        fileObject[file].r_name = name;
        fileObject[file].category = 0;
        fileObject[file].value = value;
        data.nodes.push(fileObject[file]);
        value++;
      }
      writeFile('export const project =' + JSON.stringify(data))
    }
  }).on('error', function(e) {

  });
});


function writeFile(data){
  fs.writeFile(filePath + "/client/js/"+"constants.js",data,function(err){
    if(err) throw err;
  });
}