## 📝 Webpack 篇总结
我们现在已经梳理清楚了 Webpack 的三根支柱：
```
1. Core：利用 AST 构建依赖图谱，用闭包 + require 模拟模块环境。

2. Loader：将各种非 JS 文件（Markdown, CSS）转换成标准的 JS 字符串。

3. Plugin：利用生命周期钩子干预构建流程。
```

在 Webpack 环境下，如果你有一千个模块，即使你只改了其中一个，工具通常也需要处理大量的依赖关系才能更新。
在开发阶段把所有文件硬挤进一个巨大的 bundle.js 里