/*
 * @Author: wenbo huwboo@163.com
 * @Date: 2026-01-07 14:53:32
 * @LastEditors: wenbo huwboo@163.com
 * @LastEditTime: 2026-01-07 16:42:18
 * @FilePath: /my-webpack/vite/loader/@vue/compiler-sfc.js
 * @Description: 
 */

function miniVueCompiler(source) {
  // 1. 提取三部分内容 (正则大法)
  const template = source.match(/<template>([\s\S]*?)<\/template>/)[1].trim();
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1].trim();
  const style = source.match(/<style>([\s\S]*?)<\/style>/)?.[1].trim() || '';

  // 2. 改造 Script：把 export default 换成变量定义
  let scriptJs = script.replace('export default', 'const __script =');

  // 3. 改造 Template：变成一个返回字符串的函数
  // 将 {{ key }} 替换为 ${this.key}
  const htmlWithVars = template.replace(/\{\{(.*?)\}\}/g, (_, key) => `\${this.${key.trim()}}`);
  
  // 4. 处理 Style：生成一段 JS，动态把样式插入 head
  const styleJs = `
    const styleTag = document.createElement('style');
    styleTag.innerHTML = \`${style}\`;
    document.head.appendChild(styleTag);
  `;

  // 5. 拼装成合法的 ESM
  return `
    ${styleJs}
    ${scriptJs}
    
    // 给组件对象挂载一个静态渲染方法
    __script.render = function() {
      // 这里的 this 指向组件实例数据
      return \`${htmlWithVars}\`;
    };
    
    export default __script;
  `;
}

module.exports = miniVueCompiler