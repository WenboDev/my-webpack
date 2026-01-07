function rewriteImport(content) {
  // 这个正则的意思是：
  // 匹配 from 后面的引号内容
  // 并且排除掉以 . 或 / 开头的路径
  return content.replace(/ from ['"]([^./].*?)['"]/g, (s, s1) => {
    // s1 就是匹配到的包名，比如 "vue"
    return ` from '/@modules/${s1}'`;
  });
}

module.exports = rewriteImport


// --- 测试一下 ---
// const code = `
// import { createApp } from 'vue';
// import App from './App.vue';
// `;

// console.log(rewriteImport(code));
// 输出:
// import { createApp } from '/@modules/vue';
// import App from './App.vue';