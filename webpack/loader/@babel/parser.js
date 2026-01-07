const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const jsonLoader = require('../json-loader.js')

let ID = 0;

function createAsset(filename) {
  // 1. 读取文件内容
  let content = fs.readFileSync(filename, 'utf-8');

  // 这里的逻辑就是 Loader 的本质！
  if (filename.endsWith('.json')) {
    content = jsonLoader(content); // 转换为 JS 字符串
  }

  // 2. 将代码转化为 AST
  const ast = parser.parse(content, {
    sourceType: 'module',
  });

  // 3. 提取依赖
  const dependencies = [];
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      // 这里的 node.source.value 就是 import 后面跟着的路径
      dependencies.push(node.source.value);
    },
  });

  // 4. 转换代码（ESM -> CommonJS）
  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ['@babel/preset-env'],
  });

  // 返回 Asset 对象
  return {
    id: ID++,
    filename,
    dependencies,
    code,
  };
}

// var res = createAsset('../../../src/index.js')
// console.log(res)
// {
//   id: 0,
//   filename: '../../../src/index.js',
//   dependencies: [ './message.js' ],
//   code: '"use strict";\n' +
//     '\n' +
//     'var _message = _interopRequireDefault(require("./message.js"));\n' +
//     'function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }\n' +
//     '(0, _message["default"])();'
// }
function createGraph(entry) {
  const mainAsset = createAsset(entry);
  const queue = [mainAsset];

  // 1. 这里的 allAssets 就是我们的缓存表 🗃️
  // Key: 文件的绝对路径, Value: Asset 对象
  const allAssets = { [entry]: mainAsset };

  for (const asset of queue) {
    asset.mapping = {};
    const dirname = path.dirname(asset.filename);

    asset.dependencies.forEach(relativePath => {
      const childPath = path.join(dirname, relativePath);

      // 2. 核心逻辑：检查缓存
      if (!allAssets[childPath]) {
        // 缓存没命中，解析新文件
        const childAsset = createAsset(childPath);
        allAssets[childPath] = childAsset; // 存入缓存
        queue.push(childAsset);            // 加入队列继续找它的依赖
      }

      // 3. 无论是否新解析，都要建立映射关系
      asset.mapping[relativePath] = allAssets[childPath].id;
    });
  }

  return queue;
}
module.exports = createGraph

// var res2 = createGraph('../../../src/index.js')
// console.log(res2)
// [
//   {
//     id: 0,
//     filename: '../../../src/index.js',
//     dependencies: [ './message.js' ],
//     code: '"use strict";\n' +
//       '\n' +
//       'var _message = _interopRequireDefault(require("./message.js"));\n' +
//       'function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }\n' +
//       '(0, _message["default"])();',
//     mapping: { './message.js': 1 }
//   },
//   {
//     id: 1,
//     filename: '../../../src/message.js',
//     dependencies: [],
//     code: `"use strict";\n\nconsole.log('msg');`,
//     mapping: {}
//   }
// ]
