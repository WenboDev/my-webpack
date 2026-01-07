// (function (modules) {
//   function require(id) {
//     const [fn, mapping] = modules[id];

//     // 这是一个内部 require，用来把源代码里的路径转成 ID
//     function localRequire(relativePath) {
//       return require(mapping[relativePath]);
//     }

//     const module = { exports: {} };
//     // 执行模块代码，注入工具函数
//     fn(localRequire, module, module.exports);

//     return module.exports;
//   }

//   require(0); // 从入口开始执行
// })({
//   0: [
//     function (require, module, exports) {
//       // index.js 转换后的代码
//       const message = require('./message.js');
//       console.log(message);
//     },
//     { './message.js': 1 }
//   ],
//   1: [
//     function (require, module, exports) {
//       // message.js 转换后的代码
//       module.exports = "Hello Webpack!";
//     },
//     {}
//   ]
// })

const parser = require('./parser.js');

function bundle(graph) {
  let modules = '';

  // 1. 构建 modules 字符串
  graph.forEach(mod => {
    modules += `${mod.id}: [
      function (require, module, exports) {
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)},
    ],`;
  });

  // 2. 返回完整的 IIFE 字符串
  return `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];

        function localRequire(relativePath) {
          return require(mapping[relativePath]);
        }

        const module = { exports: {} };
        fn(localRequire, module, module.exports);

        return module.exports;
      }

      require(0); // 执行入口
    })({${modules}})
  `;
}

const graph = parser('../../src/index.js')
const res = bundle(graph)
console.log('🚀: ~ res:', res)
  // (function (modules) {
  //   function require(id) {
  //     const [fn, mapping] = modules[id];

  //     function localRequire(relativePath) {
  //       return require(mapping[relativePath]);
  //     }

  //     const module = { exports: {} };
  //     fn(localRequire, module, module.exports);

  //     return module.exports;
  //   }

  //   require(0); // 执行入口
  // })({
  //   0: [
  //     function (require, module, exports) {
  //       "use strict";

  //       var _message = _interopRequireDefault(require("./message.js"));
  //       function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
  //       (0, _message["default"])();
  //     },
  //     { "./message.js": 1 },
  //   ], 1: [
  //     function (require, module, exports) {
  //       "use strict";

  //       console.log('msg');
  //     },
  //     {},
  //   ],
  // })

  