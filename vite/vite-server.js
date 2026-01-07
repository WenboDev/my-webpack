/*
 * @Author: wenbo huwboo@163.com
 * @Date: 2026-01-07 14:39:11
 * @LastEditors: wenbo huwboo@163.com
 * @LastEditTime: 2026-01-07 16:39:40
 * @FilePath: /my-webpack/vite/vite-server.js
 * @Description: 
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

// 路径改写函数：把 import 'xxx' 变成 import '/@modules/xxx'
const rewriteImport = require('./loader/rewriteImport.js');

// function rewriteImport(content) {
//   return content.replace(/ from ['"]([^./].*?)['"]/g, (s, s1) => {
//     return ` from '/@modules/${s1}'`;
//   });
// }

const miniVueCompiler = require('./loader/@vue/compiler-sfc.js')


const server = http.createServer((req, res) => {
  const url = req.url;

  // 1. 首页：直接返回 index.html
  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync('./index.html'));
  }

  // 2. 处理 JS 文件：进行路径改写
  else if (url.endsWith('.js') && !url.includes('@modules')) {
    const p = path.join(__dirname, url);
    const content = fs.readFileSync(p, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    // 核心：返回改写后的代码，让浏览器去请求 /@modules
    res.end(rewriteImport(content));
  }

  // 3. 核心黑魔法：处理 /@modules/ 开头的请求
  else if (url.startsWith('/@modules/')) {
    const moduleName = url.replace('/@modules/', '');
    // 简单起见，我们直接去 node_modules 下找对应包的 index.js
    const projectRoot = path.resolve(__dirname, '..')
    // const modulePath = path.join(__dirname, 'node_modules', moduleName, 'index.js');
    const modulePath = path.join(projectRoot, 'node_modules', moduleName, 'index.js'    )
    const content = fs.readFileSync(modulePath, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(content);
  }

  // 处理 .vue 文件：进行 sfc 提取/转换
  else if (url.endsWith('.vue')) {
    const p = path.join(__dirname, url);
    const content = fs.readFileSync(p, 'utf-8');
    const scriptCode = miniVueCompiler(content)
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    // 核心：返回改写后的 vue 代码
    res.end(rewriteImport(scriptCode));
  }
});

server.listen(3000, () => {
  console.log('🚀 Mini-Vite 启动在 http://localhost:3000');
});