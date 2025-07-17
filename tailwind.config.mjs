// tailwind.config.mjs
export default {
    darkMode: 'class',
    content: [
      './src/**/*.{js,ts,jsx,tsx}',
      './src/app/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          background: 'var(--background)',
          foreground: 'var(--foreground)',
        },
      },
    },
    plugins: [],
  };