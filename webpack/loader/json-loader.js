// json-loader.js
function jsonLoader(source) {
  // source 是 '{"name": "Gemini"}'
  // 我们把它包装成 JS 导出
  return `module.exports = ${source}`;
}

module.exports = jsonLoader