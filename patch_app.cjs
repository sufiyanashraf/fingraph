const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add states
if (!code.includes('showSplash')) {
  code = code.replace(
    /const \[theme, setTheme\] = useState.*?;/,
    `const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);`
  );

  // Add timeout in useEffect
  code = code.replace(
    /document\.body\.style\.color = initialTheme === 'dark' \? '#f9fafb' : '#111827';/,
    `document.body.style.color = initialTheme === 'dark' ? '#f9fafb' : '#111827';
    
    // Splash screen timer
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => setShowSplash(false), 500); // Wait for fade out animation
    }, 2000);
    return () => clearTimeout(timer);`
  );

  // Add the splash screen UI at the top of the return block
  const splashUI = `
    {showSplash && (
      <div className={\`fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-900 \${isFadingOut ? 'animate-fade-out' : ''}\`}>
        <div className="flex flex-col items-center">
          <img 
            src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'} 
            alt="FinGraph Lab Logo" 
            className="w-32 h-32 md:w-48 md:h-48 animate-rotate-3d drop-shadow-2xl" 
          />
          <h1 className="mt-8 text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase">
            FinGraph Lab
          </h1>
        </div>
      </div>
    )}
  `;

  code = code.replace(
    /<Router>/,
    `<Router>\n${splashUI}`
  );

  fs.writeFileSync('src/App.tsx', code);
}

console.log('App patched');
