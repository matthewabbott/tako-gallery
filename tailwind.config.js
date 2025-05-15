/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            screens: {
                'xs': '480px',
            },
            fontFamily: {
                sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
            },
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                'tako-dark-bg': '#17191C',
                'tako-dark-surface': '#22252B',
                'tako-dark-border': '#31363F',
                'tako-dark-text-primary': '#E5E7EB',
                'tako-dark-text-secondary': '#868E93',
                'tako-dark-accent': '#9785FF',
                'tako-dark-accent-hover': '#97B6F9',
                'tako-dark-contrast-border': '#F4F4F6',
            },
        },
    },
    plugins: [],
}
