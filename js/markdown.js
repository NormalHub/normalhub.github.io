var convertToHTML = function (text){
  // 转换标题
  text = text.replace(/^(#+)\s(.+)/gm, (match, p1, p2) => {
    const level = p1.length;
    return `<h${level}>${p2}</h${level}>`;
  });
  // 转换粗体和斜体
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // 转换列表
  text = text.replace(/^\s*-\s(.+)/gm, '<li>$1</li>');
  text = text.replace(/^\s*1\.\s(.+)/gm, '<li>$1</li>');
  // 转换代码块
  text = text.replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>');
  // 转换水平分隔线
  text = text.replace(/^-{3,}/gm, '<hr>');
  // 转换普通段落
  text = text.replace(/^(?![<\/*h])(.+)$/gm, '<p>$1</p>');
  // 转换链接
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a target="_blank" href="$2">$1</a>');
  // 转换图片
  text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" href="$2">');
  return text;
}
export {convertToHTML};

/*使用
const markdownText = `
# 标题 1
## 标题 2
### 标题 3
**粗体文本**
*斜体文本*
- 列表项 1
- 列表项 2
1. 编号项 1
2. 编号项 2
\`\`\`function example() {console.log('这是一个代码块');}\`\`\`
---分割线
这是一个普通段落。`;
*/