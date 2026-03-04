/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,html}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#0668e0',
                'background-light': '#f5f7f8',
                'background-dark': '#0f1823',
            },
            fontFamily: {
                display: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
