const css = "body { color: red; }"; // 这是上一个 loader 传来的
const style = document.createElement('style');
style.innerHTML = css;
document.head.appendChild(style);