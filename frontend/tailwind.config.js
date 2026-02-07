/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5',  // Indigo - Brand Color
                secondary: '#38BDF8', // Sky Blue - Accents
                accent: '#38BDF8',    // Keeping alias for compatibility
                background: '#F8FAFC', // Light Background
                card: '#FFFFFF',      // White for cards
                text: '#0F172A',      // Dark Slate for text
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
