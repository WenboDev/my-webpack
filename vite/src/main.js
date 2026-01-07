/*
 * @Author: wenbo huwboo@163.com
 * @Date: 2026-01-07 15:20:48
 * @LastEditors: wenbo huwboo@163.com
 * @LastEditTime: 2026-01-07 16:44:43
 * @FilePath: /my-webpack/vite/src/main.js
 * @Description: 
 */
// 故意不写 ./，模拟第三方库导入
import { msg } from 'hello'; 
document.getElementById('app').innerText = msg;

// import { createApp } from 'vue';
import App from './App.vue';

// 1. 初始化模拟“组件实例”
const vm = {
  ...App.data(), // 展开 data 里的数据
  ...App.methods  // 展开方法
};

// 2. 绑定方法的 this 指向
if (App.methods) {
  Object.keys(App.methods).forEach(key => {
    vm[key] = App.methods[key].bind(vm);
  });
}

// 3. 执行渲染并挂载
const appDiv = document.getElementById('app');
appDiv.innerHTML = App.render.call(vm); // 通过 call 绑定 this 为数据对象

// 4. 测试方法执行 (如果在 script 里定义了 mount 函数)
console.log('🚀: ~ vm:', App)
if (App.mount) App.mount.call(vm);
