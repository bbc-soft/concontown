// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        smtown: [
          '"SMTOWN"',
          '"Noto Sans JP"',
          '"Hiragino Kaku Gothic ProN"',
          'Meiryo',
          'sans-serif',
        ],
        fontFamily: {
          sans: [
            '"Noto Sans JP"',
            '"Noto Sans KR"',
            '"Noto Sans SC"',
            '"Noto Sans TC"',
            '"Apple SD Gothic Neo"',
            '"PingFang SC"',
            '"Hiragino Kaku Gothic ProN"',
            'Meiryo',
            'sans-serif',
          ],
        }
        
      },
      colors: {
        background: '#ffffff',
        text: '#000000',
      },
      animation: {
        slide: 'slide 20s linear infinite',
        marquee: 'marquee 20s linear infinite',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
