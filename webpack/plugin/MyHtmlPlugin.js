// 自动生成 index.html
class MyHtmlPlugin {
  apply(compiler) {
    // 1. 在生成资源到 output 目录之前触发
    compiler.hooks.emit.tap('MyHtmlPlugin', (compilation) => {
      // 2. 获取最终生成的文件名 (比如 bundle.js)
      const assetName = Object.keys(compilation.assets)[0];

      // 3. 构建 HTML 内容
      const content = `
        <html>
          <body>
            <script src="${assetName}"></script>
          </body>
        </html>`;

      // 4. 将生成的 HTML 文件添加到输出资源中
      compilation.assets['index.html'] = {
        source: () => content,
        size: () => content.length
      };
    });
  }
}