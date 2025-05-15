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
                    50: '#eef2ff',  // indigo-50
                    100: '#e0e7ff', // indigo-100
                    200: '#c7d2fe', // indigo-200
                    300: '#a5b4fc', // indigo-300
                    400: '#818cf8', // indigo-400
                    500: '#6366f1', // indigo-500
                    600: '#4f46e5', // indigo-600
                    700: '#4338ca', // indigo-700
                    800: '#3730a3', // indigo-800
                    900: '#312e81', // indigo-900
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
