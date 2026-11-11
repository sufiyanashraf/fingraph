const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('@keyframes rotate3d')) {
  css += `\n
@keyframes rotate3d {
  0% { transform: perspective(1000px) rotateY(0deg); }
  50% { transform: perspective(1000px) rotateY(180deg); }
  100% { transform: perspective(1000px) rotateY(360deg); }
}
.animate-rotate-3d {
  animation: rotate3d 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes fadeOut {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(1.1); visibility: hidden; }
}
.animate-fade-out {
  animation: fadeOut 0.5s ease-out forwards;
}
`;
  fs.writeFileSync('src/index.css', css);
}
console.log('Done');
