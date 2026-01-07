const { SyncHook } = require('tapable');

class MyWebpack {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(['config']),    // 开始打包前的钩子
      emit: new SyncHook(['assets']),   // 生成文件前的钩子
    };

    // 1. 初始化插件：让每个插件把自己的逻辑“挂”到钩子上
    if (options.plugins) {
      options.plugins.forEach(plugin => plugin.apply(this));
    }
  }

  generate() {
    // 2. 在特定时机触发钩子
    this.hooks.run.call(this.options);
    
    const graph = createGraph(this.options.entry);
    const bundleCode = bundle(graph);

    this.hooks.emit.call(bundleCode);
    return bundleCode;
  }
}