/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        georama: ["Georama", "sans-serif"],
        georamalight: ["GEORAMALight","sans-serif"],
        raleway: ["Raleway", "sans-serif"],
        ralewaybold: ["RALEWAYBold", "sans-serif"],
        kanitBold: ["KANITBold", "sans-serif"],
        kanitRegular: ["KANITRegular", "sans-serif"],
        kanitBlack: ["KANITBlack", "sans-serif"],
        kanitMedium: ["KANITMedium", "sans-serif"],
        kanitLight:["KANITLight", "sans-serif"]
      },
      colors: {
        'terracotta': '#B85042',
        'sand': '#E7E8D1',
        'sage': '#A7BEAE',
        'PrimaryDarkPurple': '#5D5FEF',
        'PrimaryDarkComplimentary':'#A2A4F6',
        'PrimaryLightPurple': '#E4E5FF',
        'PrimaryBackground': '#F8F8FF',
      },
    },
  },
  plugins: [],
}