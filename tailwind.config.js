/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}", // если используешь app directory
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['MorfinSans', 'sans-serif'],
                morfin: ['MorfinSans', 'sans-serif'],
            },
        },
    },
    plugins: [],
}