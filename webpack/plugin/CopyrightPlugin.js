// 在所有生成的 JS 文件头部自动加上一行注释 /* Copyright by Me */
class CopyrightPlugin {
  apply(compiler) {
    // 订阅 emit 钩子
    compiler.hooks.emit.tap('CopyrightPlugin', (compilation) => {
      // 1. 遍历所有即将生成的资源文件
      for (const filename in compilation.assets) {
        if (filename.endsWith('.js')) {
          // 2. 获取原本的文件内容
          const oldSource = compilation.assets[filename].source();
          
          // 3. 拼接版权注释
          const newSource = `/* Copyright by Me */\n${oldSource}`;
          
          // 4. 重写资源
          compilation.assets[filename] = {
            source: () => newSource,
            size: () => newSource.length,
          };
        }
      }
    });
  }
}