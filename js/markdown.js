var markdownToHTML = function(text) {
  text = text.replace(/^(#+)\s(.+)$/gm, (match, level, text) => {
    const headerLevel = level.length;
    return `<h${headerLevel}>${text}</h${headerLevel}>`;
  });
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  text = text.replace(/^\s*-\s(.+)$/gm, (match, item) => {
    return `<li>${item}</li>`;
  });
  text = text.replace(/<\/li>\n/g, '</li>\n');
  text = text.replace(/<\/ul>\n/g, '</ul>');
  text = text.replace(/<ul>(.+)<\/ul>/g, (match, items) => {
    return `<ul>${items}</ul>`;
  });
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a target="_blank" href="$2">$1</a>');
  // text = text.replace(/(.+)(\n\n)/g, '<p>$1</p>');//错误
  text = text.replace(/\n/g, '<br>');//暂时代替 ↑
  text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" href="$2">');
  return text;
}
export {markdownToHTML};
/*
@@@@@@@@@@@@@@@@@@@
@@@%+=--*@@#=-+%@@@
@@*-----:==:----*@@
@@+-------------+@@
@@@+-----------+@@@
@@@@#=-------=#@@@@
@@@@@@#=---=#@@@@@@
@@@@@@@@#*#@@@@@@@@
*/