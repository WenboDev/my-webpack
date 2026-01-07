## Vite 的口号是“不打包” (No-bundle)
```
Vite 的逻辑是：

让浏览器做主：当你在 HTML 里写 <script type="module" src="/src/main.js"> 时，浏览器发现 main.js 里有 import { add } from './utils.js'，它会自动向服务器发起一个针对 /src/utils.js 的 HTTP 请求。

按需拦截：Vite 的开发服务器（Dev Server）会拦截这个请求。如果请求的是 .js，直接返回；如果请求的是 .vue 或 .ts，Vite 会在后台迅速将其编译成 JS 字符串，然后扔回给浏览器。
```


## 🌐 Vite 开发服务器的执行流程
```
我们可以把这个过程拆解为以下几个关键步骤：

1. 静态资源托管：将项目根目录作为静态资源服务器。

2. 代码拦截：拦截所有 .js (或 .vue, .ts) 请求。

3. 路径转换：将代码中第三方库的路径（如 vue）改写为带 /node_modules/ 的路径。

4. 按需编译：如果请求的是 .vue 文件，实时调用编译器将其拆解并转换为 JS。
```