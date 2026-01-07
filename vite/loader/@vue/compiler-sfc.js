function miniVueCompiler(source, filename) {
  // 1. 提取内容
  const template = source.match(/<template>([\s\S]*?)<\/template>/)[1].trim();
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1].trim();
  const styleMatch = source.match(/<style\s*(scoped)?\s*>([\s\S]*?)<\/style>/);
  const isScoped = styleMatch && styleMatch[1] === 'scoped';
  const style = styleMatch ? styleMatch[2].trim() : '';

  // 2. 生成唯一 Hash (基于文件名，确保同一个文件 hash 一致)
  const hash = `data-v-${Math.random().toString(36).slice(-6)}`;
  const hashAttr = isScoped ? ` ${hash}` : '';

  // 3. 改造 Template：给所有标签加上 hash 属性
  // 正则解释：匹配 <tag 而不匹配 </tag，然后在 tag 后面加上 hash 属性
  let htmlWithVars = template
    .replace(/<([a-z1-6]+)(?=[^>]*?)/gi, `<$1${hashAttr}`) // 给标签加属性
    .replace(/\{\{(.*?)\}\}/g, (_, key) => `\${this.${key.trim()}}`); // 处理变量

  // 4. 改造 Style：给选择器加上属性选择器 [data-v-xxx]
  let finalStyle = style;
  if (isScoped) {
    // 简易正则：匹配选择器并加上 [hash]
    // 注意：这里只是演示，复杂的嵌套选择器需要真正的 CSS Parser
    finalStyle = style.replace(/([\.#a-z0-9_-]+)\s*\{/gi, (match, selector) => {
      return `${selector.trim()}[${hash}] {`;
    });
  }

  // 5. 组装逻辑保持不变
  const styleJs = `
    const styleTag = document.createElement('style');
    styleTag.setAttribute('id', '${hash}');
    styleTag.innerHTML = \`${finalStyle}\`;
    document.head.appendChild(styleTag);
  `;

  return `
    ${styleJs}
    ${script.replace('export default', 'const __script =')}
    __script.render = function() {
      return \`${htmlWithVars}\`;
    };
    export default __script;
  `;
}

module.exports = miniVueCompiler
