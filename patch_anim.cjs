const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('@keyframes slideDown')) {
  css += `\n
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-down {
  animation: slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
`;
  fs.writeFileSync('src/index.css', css);
}
console.log('Done');
